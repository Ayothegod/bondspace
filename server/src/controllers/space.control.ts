import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../utils/client.js";
import { SocketEventEnum } from "../utils/constants.js";
import { emitSocketEvent } from "../utils/socket.js";

const createASpace = asyncHandler(async (req: Request, res: Response) => {
  const { name } = req.body;

  const newSpace = await prisma.space.create({
    data: {
      name: name,
      status: "started",
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

  if (!newSpace) {
    throw new ApiError(404, "Error while creating space.");
  }

  newSpace.participants.forEach((participant) => {
    // emit event to the creator with newSpace as payload
    emitSocketEvent(
      req,
      participant.id,
      SocketEventEnum.NEW_SPACE_EVENT,
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
    console.log(spaceId, participantId);

    const space = await prisma.space.findUnique({
      where: {
        id: spaceId,
      },
      include: {
        participants:true
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

    if (!updatedSpace) {
      throw new ApiError(500, "Unable to add user to space.");
    }

    updatedSpace.participants.forEach((participant) => {
      if (participant.id === req.user?.id) return;

      emitSocketEvent(
        req,
        participant.id,
        SocketEventEnum.JOIN_SPACE_EVENT,
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
        participants:true
      },
    });

    if (!space) {
      throw new ApiError(404, "Space does not exist");
    }

    const isParticipant = space.participants.some(
      (participant) => participant.id === participantId
    );

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

    if (!updatedSpace) {
      throw new ApiError(500, "Unable to remove user from space.");
    }

    updatedSpace.participants.forEach((participant) => {
      if (participant.id === req.user?.id) return;

      emitSocketEvent(
        req,
        participant.id,
        SocketEventEnum.LEAVE_SPACE_EVENT,
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
  console.log(spaceId);

  const space = await prisma.space.findUnique({
    where: {
      id: spaceId,
    },
    include: {
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

  if (!updatedSpace) {
    throw new ApiError(500, "Error occured while updating space.");
  }

  updatedSpace.participants.forEach((participant) => {
    emitSocketEvent(
      req,
      participant.id,
      SocketEventEnum.UPDATE_SPACE_NAME_EVENT,
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
  addNewParticipantToSpace, createASpace, getSpaceDetails, removeParticipantFromSpace, renameSpace
};

