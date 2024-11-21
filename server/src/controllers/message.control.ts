import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../utils/client.js";
import { SocketEventEnum } from "../utils/constants.js";
import { emitSocketEvent } from "../utils/socket.js";

// DONE:
const getAllMessages = asyncHandler(async (req: Request, res: Response) => {
  const { chatId } = req.params;
  const { spaceId } = req.body;

  const selectedChat = await prisma.chat.findUnique({
    where: {
      id: chatId,
      spaceId: spaceId,
    },
    include: {
      participants: true,
    },
  });

  if (!selectedChat) {
    throw new ApiError(404, "Chat does not exist");
  }

  const isParticipant = selectedChat.participants.some(
    (participant) => participant.id === req.user?.id
  );

  if (!isParticipant) {
    throw new ApiError(400, "User is not a part of this chat.");
  }

  const messages = await prisma.message.findMany({
    where: {
      chatId: chatId,
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          // avatar: {
          //   select: {
          //     imageURL: true,
          //   },
          // },
          email: true,
        },
      },
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, messages, "Group chat fetched successfully"));
});

// DONE:
const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const { chatId } = req.params;
  const { content, spaceId } = req.body;

  const chat = await prisma.chat.findUnique({
    where: {
      id: chatId,
      spaceId: spaceId,
    },
    include: {
      participants: true,
    },
  });

  if (!chat) {
    throw new ApiError(404, "chat does not exist");
  }

  const message = await prisma.message.create({
    data: {
      content: content,
      chatId: chatId,
      senderId: req.user?.id as string,
    },
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
  });

  if (!message) {
    throw new ApiError(500, "Error occured while sending message.");
  }

  chat.participants.forEach((participant) => {
    if (participant.id === req.user?.id) return;

    emitSocketEvent(req, participant.id, SocketEventEnum.NEW_MESSAGE, message);
  });

  return res
    .status(200)
    .json(new ApiResponse(200, message, "Message sent successfully"));
});

// DONE:
const deleteMessage = asyncHandler(async (req: Request, res: Response) => {
  const { chatId, messageId } = req.params;
  const { spaceId } = req.body;

  const chat = await prisma.chat.findUnique({
    where: {
      id: chatId,
      spaceId: spaceId,
    },
    include: {
      participants: true,
    },
  });

  if (!chat) {
    throw new ApiError(404, "chat does not exist");
  }

  const message = await prisma.message.findUnique({
    where: {
      id: messageId,
      chatId: chatId,
    },
  });

  if (!message) {
    throw new ApiError(404, "Message does not exist");
  }

  if (message.senderId !== req.user?.id) {
    throw new ApiError(
      403,
      "You are not the authorised to delete the message, you are not the sender."
    );
  }

  const deletedMessage = await prisma.message.delete({
    where: {
      id: messageId,
      chatId: chatId,
    },
  });

  if (!deletedMessage) {
    throw new ApiError(500, "Error occured while deleting message.");
  }

  chat.participants.forEach((participant) => {
    if (participant.id === req.user?.id) return;

    emitSocketEvent(
      req,
      participant.id,
      SocketEventEnum.MESSAGE_DELETE_EVENT,
      message
    );
  });

  return res
    .status(200)
    .json(new ApiResponse(200, message, "Message deleted successfully"));
});

export { deleteMessage, sendMessage, getAllMessages };
