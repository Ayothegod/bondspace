import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../utils/client.js";
import { SocketEventEnum } from "../utils/constants.js";
import { emitSocketEvent } from "../utils/socket.js";

// DONE:
const getChatDetails = asyncHandler(async (req: Request, res: Response) => {
  const { chatId, spaceId } = req.params;

  const chat = await prisma.chat.findUnique({
    where: {
      id: chatId,
      spaceId: spaceId,
    },
    include: {
      messages: {
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              avatar: {
                select: {
                  imageURL: true,
                },
              },
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      participants: {
        select: {
          id: true,
          username: true,
          avatar: {
            select: {
              imageURL: true,
            },
          },
          email: true,
        },
      },
    },
  });

  if (!chat) {
    throw new ApiError(404, "Chat does not exist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, chat, "Group chat fetched successfully"));
});

// DONE:
const renameChat = asyncHandler(async (req: Request, res: Response) => {
  const { chatId, spaceId } = req.params;
  const { name } = req.body;

  const chat = await prisma.chat.findUnique({
    where: {
      id: chatId,
      spaceId: spaceId,
    },
  });

  if (!chat) {
    throw new ApiError(404, "Group chat does not exist");
  }

  const updatedChat = await prisma.chat.update({
    where: {
      id: chatId,
    },
    data: {
      name: name,
    },
    include: {
      messages: {
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              avatar: {
                select: {
                  imageURL: true,
                },
              },
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      participants: {
        select: {
          id: true,
          username: true,
          avatar: {
            select: {
              imageURL: true,
            },
          },
          email: true,
        },
      },
    },
  });

  if (!updatedChat) {
    throw new ApiError(500, "Error occured while renaming space chat.");
  }

  updatedChat.participants.forEach((participant) => {
    if (participant.id === req.user?.id) return;

    emitSocketEvent(
      req,
      participant.id,
      SocketEventEnum.UPDATE_CHAT_NAME_EVENT,
      updatedChat
    );
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedChat, "Chat name updated successfully"));
});

export { getChatDetails, renameChat };
