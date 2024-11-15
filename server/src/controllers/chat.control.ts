import { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../utils/client.js";
import { AuthErrorEnum, ChatEventEnum } from "../utils/constants.js";
import { ApiError } from "../utils/ApiError.js";
import { emitSocketEvent } from "../utils/socket.js";

// on client -> as a user that wants to chat
// -> search available user
// if user () => send welcome message and also invite
// if accepted () => start chatting
// if !user or !ourFriend () => invite user

// const getAllChats = asyncHandler(async (req: Request, res: Response) => {
//   const { email, username, password, fullname } = req.body;

//   return res
//     .status(200)
//     .json(new ApiResponse(200, "OK", "User registered successfully"));
// });

const searchAvailableUsers = asyncHandler(
  async (req: Request, res: Response) => {
    const users = await prisma.user.findMany({
      where: {
        NOT: {
          id: req.user?.id,
        },
      },
    });

    if (!users) {
      console.log(
        "searchAvailableUsers - Users not available. Invite a new user instead."
      );
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            AuthErrorEnum.USER_NOT_FOUND,
            "Users not available. Invite a new user instead."
          )
        );
    }

    return res
      .status(200)
      .json(new ApiResponse(200, users, "Users fetched successfully"));
  }
);

// TODO: closed route
const createOrGetAOneOnOneChat = asyncHandler(
  async (req: Request, res: Response) => {
    const { receiverId } = req.params;

    const receiver = await prisma.user.findUnique({
      where: {
        id: receiverId,
      },
    });

    if (!receiver) {
      throw new ApiError(400, "This user does not exist!");
    }

    if (receiver.id === req.user?.id) {
      throw new ApiError(400, "You cannot chat with yourself");
    }

    // Because of our multi chat system schema, we can't get sinle message between 2 users, so we get all messages they both feature in
    const gameChat = await prisma.gameSession.findMany({
      where: {
        isGroupGame: false,
        players: {
          some: {
            id: req.user?.id,
          },
        },
        AND: [
          {
            players: {
              some: {
                id: receiverId,
              },
            },
          },
        ],
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (gameChat.length) {
      // if we find the chat that means user already has created a chat
      return res
        .status(200)
        .json(new ApiResponse(200, gameChat, "Chat retrieved successfully"));
    }

    const newGameChatInstance = await prisma.gameSession.create({
      data: {
        name: "One on one chat",
        status: "started",
        isGroupGame: false,
        players: {
          connect: [{ id: req.user?.id }, { id: receiverId }],
        },
        gameType: "chat",
        rounds: 0,
      },
      include: {
        players: true, // Include the players relation in the result
      },
    });

    if (!newGameChatInstance) {
      throw new ApiError(404, "Error while creating group chat.");
    }

    const gameSession = await prisma.gameSession.findUnique({
      where: {
        id: newGameChatInstance.id,
      },
      include: {
        players: {
          // Participants in the session
          select: {
            id: true,
            username: true,
            avatar: true,
            email: true,
          },
        },
        messages: {
          // Fetch the most recent message
          orderBy: {
            createdAt: "desc",
          },
          take: 5, // Limit to the most recent message
          select: {
            content: true,
            sender: {
              select: {
                username: true,
                avatar: true,
              },
            },
            createdAt: true,
          },
        },
      },
    });

    if (!gameSession) {
      throw new ApiError(500, "Internal server error");
    }

    newGameChatInstance.players.forEach((player) => {
      // if (player.id.toString() === req.user?.id.toString()) return;
      // don't emit the event for the logged in use as he is the one who is initiating the chat

      // emit event to other participants with new chat as a payload
      emitSocketEvent(
        req,
        player.id?.toString(),
        ChatEventEnum.NEW_CHAT_EVENT,
        gameSession
      );
    });

    return res
      .status(201)
      .json(new ApiResponse(201, gameSession, "Chat retrieved successfully"));
  }
);

const createAGroupChat = asyncHandler(async (req: Request, res: Response) => {
  const { name, participants } = req.body;

  if (participants.includes(req.user?.id)) {
    throw new ApiError(
      400,
      "Participants array should not contain the group creator"
    );
  }

  const members = [...new Set([...participants, req.user?.id])]; // check for duplicate

  if (members.length < 3) {
    // We want group chat to have minimum 3 members including admin
    throw new ApiError(400, "Group chat must have a minimum of 3 members.");
  }

  const newGameChatInstance = await prisma.gameSession.create({
    data: {
      name: name,
      status: "started",
      players: {
        connect: members.map((participant: string) => ({
          id: participant,
        })),
      },
      gameType: "game",
      rounds: 0,
    },
    include: {
      players: true,
    },
  });

  if (!newGameChatInstance) {
    throw new ApiError(404, "Error while creating group chat.");
  }

  const gameSession = await prisma.gameSession.findUnique({
    where: {
      id: newGameChatInstance.id,
    },
    include: {
      players: {
        select: {
          id: true,
          username: true,
          avatar: true,
          email: true,
        },
      },
      messages: {
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        select: {
          content: true,
          sender: {
            select: {
              username: true,
              avatar: true,
            },
          },
          createdAt: true,
        },
      },
    },
  });

  if (!gameSession) {
    throw new ApiError(500, "Internal server error");
  }

  newGameChatInstance.players.forEach((player) => {
    // if (player.id.toString() === req.user?.id.toString()) return;

    // emit event to other participants with new chat as a payload
    emitSocketEvent(
      req,
      player.id?.toString(),
      ChatEventEnum.NEW_CHAT_EVENT,
      gameSession
    );
  });

  return res
    .status(200)
    .json(new ApiResponse(201, gameSession, "Group chat created successfully"));
});

const getGroupChatDetails = asyncHandler(
  async (req: Request, res: Response) => {
    const { chatId } = req.params;

    const gameSession = await prisma.gameSession.findUnique({
      where: {
        id: chatId,
      },
      include: {
        players: {
          // Participants in the session
          select: {
            id: true,
            username: true,
            avatar: true,
            email: true,
          },
        },
        messages: {
          // Fetch the most recent message
          orderBy: {
            createdAt: "desc",
          },
          take: 5, // Limit to the most recent message
          select: {
            content: true,
            sender: {
              select: {
                username: true,
                avatar: true,
              },
            },
            createdAt: true,
          },
        },
      },
    });

    if (!gameSession) {
      throw new ApiError(404, "Group chat does not exist");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, gameSession, "Group chat fetched successfully")
      );
  }
);

const renameGroupChat = asyncHandler(async (req: Request, res: Response) => {
  const { chatId } = req.params;
  const { name } = req.body;

  const groupChat = await prisma.gameSession.findUnique({
    where: {
      id: chatId,
      isGroupGame: true,
    },
  });

  if (!groupChat) {
    throw new ApiError(404, "Group chat does not exist");
  }

  // // only admin can change the name
  // if (groupChat.admin?.toString() !== req.user._id?.toString()) {
  //   throw new ApiError(404, "You are not an admin");
  // }

  const updatedGroupChat = await prisma.gameSession.update({
    where: {
      id: chatId,
    },
    data: {
      name: name,
    },
    include: {
      players: {
        select: {
          id: true,
          username: true,
          avatar: true,
          email: true,
        },
      },
      messages: {
        // Fetch the most recent message
        orderBy: {
          createdAt: "desc",
        },
        take: 5, // Limit to the most recent message
        select: {
          content: true,
          sender: {
            select: {
              username: true,
              avatar: true,
            },
          },
          createdAt: true,
        },
      },
    },
  });

  if (!updatedGroupChat) {
    throw new ApiError(500, "Internal server error");
  }

  updatedGroupChat.players.forEach((player) => {
    // if (player.id.toString() === req.user?.id.toString()) return;

    // emit event to other participants with new chat as a payload
    emitSocketEvent(
      req,
      player.id?.toString(),
      ChatEventEnum.UPDATE_GROUP_NAME_EVENT,
      updatedGroupChat
    );
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedGroupChat,
        "Group chat name updated successfully"
      )
    );
});

// DANGER:
const deleteGroupChat = asyncHandler(async (req: Request, res: Response) => {
  const { chatId } = req.params;

  const groupChat = await prisma.gameSession.findUnique({
    where: {
      id: chatId,
      isGroupGame: true,
    },
  });

  if (!groupChat) {
    throw new ApiError(404, "Group chat does not exist");
  }

  // // only admin can change the name
  // if (groupChat.admin?.toString() !== req.user._id?.toString()) {
  //   throw new ApiError(404, "You are not an admin");
  // }

  const deletedGroupChat = await prisma.gameSession.delete({
    where: {
      id: chatId,
    },
    include: {
      players: {
        select: {
          id: true,
          username: true,
          avatar: true,
          email: true,
        },
      },
    },
  });

  if (!deletedGroupChat) {
    throw new ApiError(500, "Internal server error");
  }

  deletedGroupChat.players.forEach((player) => {
    // if (player.id.toString() === req.user?.id.toString()) return;

    // emit event to other participants with new chat as a payload
    emitSocketEvent(
      req,
      player.id?.toString(),
      ChatEventEnum.LEAVE_CHAT_EVENT,
      deletedGroupChat
    );
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Group chat deleted successfully"));
});

const deleteOneOnOneChat = asyncHandler(async (req: Request, res: Response) => {
  const { chatId } = req.params;

  const chat = await prisma.gameSession.findUnique({
    where: {
      id: chatId,
      isGroupGame: false,
    },
  });

  if (!chat) {
    throw new ApiError(404, "Chat does not exist");
  }

  const deletedChat = await prisma.gameSession.delete({
    where: {
      id: chatId,
    },
    include: {
      players: {
        select: {
          id: true,
          username: true,
          avatar: true,
          email: true,
        },
      },
    },
  });

  if (!deletedChat) {
    throw new ApiError(500, "Internal server error");
  }

  deletedChat.players.forEach((player) => {
    // if (player.id.toString() === req.user?.id.toString()) return;

    // emit event to other participants with new chat as a payload
    emitSocketEvent(
      req,
      player.id?.toString(),
      ChatEventEnum.LEAVE_CHAT_EVENT,
      deletedChat
    );
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Chat deleted successfully"));
});

const leaveGroupChat = asyncHandler(async (req: Request, res: Response) => {
  const { chatId } = req.params;

  const chat = await prisma.gameSession.findUnique({
    where: {
      id: chatId,
      isGroupGame: true,
    },
    include: {
      players: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!chat) {
    throw new ApiError(404, "Group chat does not exist");
  }

  const notAParticipant = chat.players.filter(
    (player) => player.id !== req.user?.id
  );

  if (notAParticipant) {
    throw new ApiError(400, "You are not a part of this group chat");
  }

  const updatedChat = await prisma.gameSession.update({
    where: {
      id: chatId,
    },
    data: {
      players: {
        disconnect: {
          id: req.user?.id,
        },
      },
    },
    include: {
      players: {
        select: {
          id: true,
          username: true,
          avatar: true,
          email: true,
        },
      },
    },
  });

  if (!updatedChat) {
    throw new ApiError(500, "Internal server error");
  }

  updatedChat.players.forEach((player) => {
    // if (player.id.toString() === req.user?.id.toString()) return;

    emitSocketEvent(
      req,
      player.id?.toString(),
      ChatEventEnum.LEAVE_CHAT_EVENT,
      updatedChat
    );
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedChat, "Left a group successfully"));
});

const addNewParticipantInGroupChat = asyncHandler(
  async (req: Request, res: Response) => {
    const { chatId, participantId } = req.params;

    const chat = await prisma.gameSession.findUnique({
      where: {
        id: chatId,
        isGroupGame: true,
      },
      include: {
        players: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!chat) {
      throw new ApiError(404, "Group chat does not exist");
    }

    // // check if user who is adding is a group admin
    // if (groupChat.admin?.toString() !== req.user._id?.toString()) {
    //   throw new ApiError(404, "You are not an admin");
    // }

    const alreadyAParticipant = chat.players.filter(
      (player) => player.id === participantId
    );

    if (alreadyAParticipant) {
      throw new ApiError(400, "Player already in a group chat");
    }

    const updatedChat = await prisma.gameSession.update({
      where: {
        id: chatId,
      },
      data: {
        players: {
          connect: {
            id: participantId,
          },
        },
      },
      include: {
        players: {
          select: {
            id: true,
            username: true,
            avatar: true,
            email: true,
          },
        },
      },
    });

    if (!updatedChat) {
      throw new ApiError(500, "Internal server error");
    }

    updatedChat.players.forEach((player) => {
      emitSocketEvent(
        req,
        player.id?.toString(),
        ChatEventEnum.JOIN_CHAT_EVENT,
        updatedChat
      );
    });

    return res
      .status(200)
      .json(new ApiResponse(200, updatedChat, "Player added successfully"));
  }
);

const removeParticipantFromGroupChat = asyncHandler(
  async (req: Request, res: Response) => {
    const { chatId, participantId } = req.params;

    const chat = await prisma.gameSession.findUnique({
      where: {
        id: chatId,
        isGroupGame: true,
      },
      include: {
        players: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!chat) {
      throw new ApiError(404, "Group chat does not exist");
    }

    // // check if user who is adding is a group admin
    // if (groupChat.admin?.toString() !== req.user._id?.toString()) {
    //   throw new ApiError(404, "You are not an admin");
    // }

    const notAParticipant = chat.players.filter(
      (player) => player.id !== participantId
    );

    if (notAParticipant) {
      throw new ApiError(400, "Player does not exist in the group chat");
    }

    const updatedChat = await prisma.gameSession.update({
      where: {
        id: chatId,
      },
      data: {
        players: {
          disconnect: {
            id: participantId,
          },
        },
      },
      include: {
        players: {
          select: {
            id: true,
            username: true,
            avatar: true,
            email: true,
          },
        },
      },
    });

    if (!updatedChat) {
      throw new ApiError(500, "Internal server error");
    }

    // emit leave chat event to the removed participant only
    // emitSocketEvent(req, participantId, ChatEventEnum.LEAVE_CHAT_EVENT, payload);

    updatedChat.players.forEach((player) => {
      emitSocketEvent(
        req,
        player.id?.toString(),
        ChatEventEnum.LEAVE_CHAT_EVENT,
        updatedChat
      );
    });

    return res
      .status(200)
      .json(new ApiResponse(200, updatedChat, "Player removed successfully"));
  }
);

const getAllChats = asyncHandler(async (req: Request, res: Response) => {
  // get all chats that have logged in user as a participant

  const chats = await prisma.gameSession.findMany({
    where: {
      players: {
        some: {
          id: req.user?.id,
        },
      },
    },
    include: {
      players: {
        select: {
          id: true,
          avatarId: true,
          email: true,
          username: true,
        },
      },
      messages: true,
    },
  });

  // const trial = await prisma.gameSession.findMany({
  //   where: {
  //     players: {
  //       none: {
  //         id: req.user?.id,
  //       },
  //     },
  //   },
  // });

  return res
    .status(200)
    .json(new ApiResponse(200, chats, "User chats fetched successfully!"));
});

export {
  searchAvailableUsers,
  createOrGetAOneOnOneChat,
  createAGroupChat,
  getGroupChatDetails,
  renameGroupChat,
  deleteGroupChat,
  deleteOneOnOneChat,
  leaveGroupChat,
  addNewParticipantInGroupChat,
  removeParticipantFromGroupChat,
  getAllChats,
};
