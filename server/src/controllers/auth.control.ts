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
import { AuthErrorEnum } from "../utils/constants.js";

const registerController = asyncHandler(async (req: Request, res: Response) => {
  const { email, username, password, fullname } = req.body;

  // Validate body data
  // console.log(email, username, password, fullname);

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: email }, { username: username }],
    },
  });

  if (existingUser) {
    console.log("User already exists with this email or username");
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          AuthErrorEnum.ALREADY_EXISTS,
          "User already exists with this email or username"
        )
      );
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email: email,
      username: username,
      fullname: fullname,
      password: hashedPassword,
    },
  });

  // Send mail

  const token = generateSessionToken();
  const session = await createSession(token, user.id);

  // console.log(token, session);
  setSessionTokenCookie(res, token);

  return res
    .status(200)
    .json(new ApiResponse(200, "OK", "User registered successfully"));
});

const loginController = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Validate body data
  console.log(password, username);

  // chcek for user
  const user = await prisma.user.findUnique({
    where: { username: username },
  });

  if (!user) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          AuthErrorEnum.USER_NOT_FOUND,
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
      .json(new ApiResponse(400, AuthErrorEnum.INVALID_CREDENTIALS, "Invalid credentials!"));
  }

  const token = generateSessionToken();
  const session = await createSession(token, user.id);

  console.log(token, session);
  setSessionTokenCookie(res, token);

  return res.status(200).json(new ApiResponse(200, "OK", "Login successful!"));
});

const forgetPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    return res
      .status(200)
      .json(new ApiResponse(200, req.user, "Secret Info here!"));
  }
);

export { registerController, loginController, forgetPasswordController };
