import { Request, Router, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { prisma } from "../utils/client.js";
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "../utils/authSession.js";
import { comparePassword, hashPassword } from "../utils/services.js";
import { ErrorEventEnum } from "../utils/constants.js";

const registerController = asyncHandler(async (req: Request, res: Response) => {
  const {
    email: userEmail,
    username: userName,
    password,
    fullname: fullName,
  } = req.body;

  // Validate body data
  // console.log(email, username, password, fullname);

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: userEmail }, { username: userName }],
    },
  });

  if (existingUser) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          ErrorEventEnum.ALREADY_EXISTS,
          "User already exists with this email or username"
        )
      );
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email: userEmail,
      username: userName,
      password: hashedPassword,
      fullname: fullName,
    },
    include: {
      avatar: {
        select: {
          imageURL: true,
        },
      },
    },
  });

  // Send mail

  const token = generateSessionToken();
  const session = await createSession(token, user.id);
  const { id, email, username, avatar } = user;

  // console.log(token, session);
  setSessionTokenCookie(res, token);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { id, email, username, avatar },
        "User registered successfully"
      )
    );
});

const loginController = asyncHandler(async (req: Request, res: Response) => {
  const { username: userName, password } = req.body;

  // Validate body data
  // console.log(password, userName);

  // chcek for user
  const user = await prisma.user.findUnique({
    where: { username: userName },
    include: {
      avatar: {
        select: {
          imageURL: true,
        },
      },
    },
  });

  if (!user) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          ErrorEventEnum.USER_NOT_FOUND,
          "User not found, please signup instead."
        )
      );
  }

  // Check password
  const passwordCheck = await comparePassword(
    password,
    user.password as string
  );
  if (!passwordCheck) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          ErrorEventEnum.INVALID_CREDENTIALS,
          "Invalid credentials!"
        )
      );
  }

  const token = generateSessionToken();
  const session = await createSession(token, user.id);
  const { id, email, username, avatar } = user;

  // console.log(token, session);
  setSessionTokenCookie(res, token);

  return res
    .status(200)
    .json(
      new ApiResponse(200, { id, email, username, avatar }, "Login successful!")
    );
});

const forgetPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    return res
      .status(200)
      .json(new ApiResponse(200, req.user, "Secret Info here!"));
  }
);

export { registerController, loginController, forgetPasswordController };
