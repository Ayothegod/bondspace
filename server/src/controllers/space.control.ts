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
// const yesterday = new Date("11-19-2024").getTime();
// const today = new Date().getTime()
// const diff = today - yesterday
// // const endAt = new Date() - new Date("11-19-2024")
const createASpace = asyncHandler(async (req: Request, res: Response) => {
  const { name, spaceDuration } = req.body;
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
            where: {
              spaceId: spaceId,
            },
            data: {
              participants: {
                connect: {
                  id: participantId,
                },
              },
            },
          },
        },
      },
      include: {
        participants: {
          select: {
            id: true,
            username: true,
            // avatar: true,
            // email: true,
          },
        },
        Chat: {
          select: {
            id: true,
            participants: {
              select: {
                username: true,
              },
            },
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
          `Participant added to space successfully.`
        )
      );
  }
);

// DONE:
const removeParticipantFromSpace = asyncHandler(
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

    const isParticipant = space.participants.some(
      (participant) => participant.id === participantId
    );
    console.log(isParticipant);

    if (!isParticipant) {
      throw new ApiError(400, "Participant does not exist in the space");
    }

    const updatedSpace = await prisma.space.update({
      where: {
        id: spaceId,
      },
      data: {
        participants: {
          disconnect: {
            id: participantId,
          },
        },
        Chat: {
          update: {
            participants: {
              disconnect: {
                id: participantId,
              },
            },
          },
        },
      },
      include: {
        participants: {
          select: {
            id: true,
            username: true,
            // avatar: true,
            // email: true,
          },
        },
        Chat: {
          select: {
            id: true,
            participants: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });

    if (!updatedSpace) {
      throw new ApiError(500, "Unable to remove user from space.");
    }

    updatedSpace.participants.forEach((participant) => {
      emitSocketEvent(
        req,
        participant.id,
        SpaceEventEnum.LEAVE_SPACE_EVENT,
        updatedSpace
      );
    });

    return res
      .status(200)
      .json(new ApiResponse(200, updatedSpace, "Player removed successfully"));
  }
);

// DONE:
const getSpaceDetails = asyncHandler(async (req: Request, res: Response) => {
  const { spaceId } = req.params;

  const space = await prisma.space.findUnique({
    where: {
      id: spaceId,
    },
    include: {
      participants: {
        select: {
          id: true,
          username: true,
          // avatar: true,
          email: true,
        },
      },
      Chat: {
        where: {
          spaceId: spaceId,
        },
        include: {
          messages: true,
          participants: true,
        },
      },
    },
  });

  if (!getSpaceDetails) {
    throw new ApiError(404, "Space does not exist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, space, "Space fetched successfully"));
});

// DONE:
const renameSpace = asyncHandler(async (req: Request, res: Response) => {
  const { spaceId } = req.params;
  const { name } = req.body;

  const space = await prisma.space.findUnique({
    where: {
      id: spaceId,
    },
  });

  if (!space) {
    throw new ApiError(404, "Space does not exist");
  }

  const updatedSpace = await prisma.space.update({
    where: {
      id: spaceId,
    },
    data: {
      name: name,
    },
    include: {
      participants: {
        select: {
          id: true,
          username: true,
          // avatar: true,
          email: true,
        },
      },
      Chat: {
        where: {
          spaceId: spaceId,
        },
        include: {
          messages: true,
          participants: true,
        },
      },
    },
  });

  if (!updatedSpace) {
    throw new ApiError(500, "Error occured while updating space.");
  }

  updatedSpace.participants.forEach((participant) => {
    emitSocketEvent(
      req,
      participant.id,
      ChatEventEnum.UPDATE_GROUP_NAME_EVENT,
      updatedSpace
    );
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedSpace, "Space name updated successfully")
    );
});

// DANGER:
// const deleteGroupChat = asyncHandler(async (req: Request, res: Response) => {
//   const { chatId } = req.params;

//   const groupChat = await prisma.gameSession.findUnique({
//     where: {
//       id: chatId,
//       isGroupGame: true,
//     },
//   });

//   if (!groupChat) {
//     throw new ApiError(404, "Group chat does not exist");
//   }

//   // // only admin can change the name
//   // if (groupChat.admin?.toString() !== req.user._id?.toString()) {
//   //   throw new ApiError(404, "You are not an admin");
//   // }

//   const deletedGroupChat = await prisma.gameSession.delete({
//     where: {
//       id: chatId,
//     },
//     include: {
//       players: {
//         select: {
//           id: true,
//           username: true,
//           avatar: true,
//           email: true,
//         },
//       },
//     },
//   });

//   if (!deletedGroupChat) {
//     throw new ApiError(500, "Internal server error");
//   }

//   deletedGroupChat.players.forEach((player) => {
//     // if (player.id.toString() === req.user?.id.toString()) return;

//     // emit event to other participants with new chat as a payload
//     emitSocketEvent(
//       req,
//       player.id?.toString(),
//       ChatEventEnum.LEAVE_CHAT_EVENT,
//       deletedGroupChat
//     );
//   });

//   return res
//     .status(200)
//     .json(new ApiResponse(200, {}, "Group chat deleted successfully"));
// });

export {
  createASpace,
  addNewParticipantToSpace,
  removeParticipantFromSpace,
  getSpaceDetails,
  renameSpace,
};
