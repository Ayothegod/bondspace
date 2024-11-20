import { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../utils/client.js";
import {
  AuthErrorEnum,
  ChatEventEnum,
  SpaceEventEnum,
} from "../utils/constants.js";
import { ApiError } from "../utils/ApiError.js";
import { emitSocketEvent } from "../utils/socket.js";
import { generate10RandomValues } from "../utils/authSession.js";

// DONE:
const createASpace = asyncHandler(async (req: Request, res: Response) => {
  const { name, spaceDuration } = req.body;

  // const yesterday = new Date("11-19-2024").getTime();
  // const today = new Date().getTime()
  // const diff = today - yesterday
  // // const endAt = new Date() - new Date("11-19-2024")

  const newSpace = await prisma.space.create({
    data: {
      name: name,
      status: "started",
      spaceDuration: spaceDuration ? spaceDuration : undefined,
      participants: {
        connect: {
          id: req.user?.id,
        },
      },
      Chat: {
        create: {
          participants: {
            connect: {
              id: req.user?.id,
            },
          },
          status: "started",
        },
      },
    },
    include: {
      participants: true,
      Chat: true,
    },
  });

  if (!newSpace) {
    throw new ApiError(404, "Error while creating space.");
  }

  newSpace.participants.forEach((participant) => {
    // emit event to the creator with newSpace as payload
    emitSocketEvent(
      req,
      participant.id,
      SpaceEventEnum.NEW_SPACE_EVENT,
      newSpace
    );
  });

  return res
    .status(200)
    .json(new ApiResponse(201, newSpace, "Space created successfully"));
});

// DONE:
const addNewParticipantToSpace = asyncHandler(
  async (req: Request, res: Response) => {
    const { spaceId, participantId } = req.params;

    const space = await prisma.space.findUnique({
      where: {
        id: spaceId,
      },
      include: {
        participants: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!space) {
      throw new ApiError(404, "Space does not exist");
    }

    const alreadyAParticipant = space.participants.some((participant) => {
      return participant.id === participantId;
    });

    if (alreadyAParticipant) {
      throw new ApiError(400, "Participant already in the space.");
    }

    const updatedSpace = await prisma.space.update({
      where: {
        id: spaceId,
      },
      data: {
        participants: {
          connect: {
            id: participantId,
          },
        },
        Chat: {
          update: {
            id: participantId,
          },
        },
      },
      include: {
        participants: {
          select: {
            id: true,
            username: true,
            avatar: true,
            email: true,
          },
        },
      },
    });

    if (!updatedSpace) {
      throw new ApiError(500, "Unable to add user to space.");
    }

    updatedSpace.participants.forEach((participant) => {
      emitSocketEvent(
        req,
        participant.id,
        SpaceEventEnum.JOIN_SPACE_EVENT,
        updatedSpace
      );
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedSpace,
          "Participant added to space successfully."
        )
      );
  }
);

// const removeParticipantFromGroupChat = asyncHandler(
//   async (req: Request, res: Response) => {
//     const { chatId, participantId } = req.params;

//     const chat = await prisma.gameSession.findUnique({
//       where: {
//         id: chatId,
//         isGroupGame: true,
//       },
//       include: {
//         players: {
//           select: {
//             id: true,
//           },
//         },
//       },
//     });

//     if (!chat) {
//       throw new ApiError(404, "Group chat does not exist");
//     }

//     // // check if user who is adding is a group admin
//     // if (groupChat.admin?.toString() !== req.user._id?.toString()) {
//     //   throw new ApiError(404, "You are not an admin");
//     // }

//     const notAParticipant = chat.players.filter(
//       (player) => player.id !== participantId
//     );

//     if (notAParticipant) {
//       throw new ApiError(400, "Player does not exist in the group chat");
//     }

//     const updatedChat = await prisma.gameSession.update({
//       where: {
//         id: chatId,
//       },
//       data: {
//         players: {
//           disconnect: {
//             id: participantId,
//           },
//         },
//       },
//       include: {
//         players: {
//           select: {
//             id: true,
//             username: true,
//             avatar: true,
//             email: true,
//           },
//         },
//       },
//     });

//     if (!updatedChat) {
//       throw new ApiError(500, "Internal server error");
//     }

//     // emit leave chat event to the removed participant only
//     // emitSocketEvent(req, participantId, ChatEventEnum.LEAVE_CHAT_EVENT, payload);

//     updatedChat.players.forEach((player) => {
//       emitSocketEvent(
//         req,
//         player.id?.toString(),
//         ChatEventEnum.LEAVE_CHAT_EVENT,
//         updatedChat
//       );
//     });

//     return res
//       .status(200)
//       .json(new ApiResponse(200, updatedChat, "Player removed successfully"));
//   }
// );

export { createASpace, addNewParticipantToSpace };
