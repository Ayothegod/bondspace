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
  });

  if (!newSpace) {
    throw new ApiError(404, "Error while creating space.");
  }

  await prisma.userSpace.create({
    data: {
      userId: req.user?.id as string,
      spaceId: newSpace.id,
    },
  });

  const spaceWithParticipants = await prisma.space.findUnique({
    where: { id: newSpace.id },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: {
                select: {
                  imageURL: true,
                },
              },
              email: true,
              fullname: true,
            },
          },
        },
        orderBy: {
          joinedAt: "asc",
        },
      },
    },
  });

  if (!spaceWithParticipants) {
    throw new ApiError(404, "This space is not available.");
  }

  spaceWithParticipants.participants.forEach((participant) => {
    if (participant.user.id === req.user?.id) return;
    // emit event to the creator with newSpace as payload
    emitSocketEvent(
      req,
      participant.user.id,
      SocketEventEnum.NEW_SPACE_EVENT,
      newSpace
    );
  });

  return res
    .status(200)
    .json(
      new ApiResponse(201, spaceWithParticipants, "Space created successfully")
    );
});

const addNewParticipantToSpace = asyncHandler(
  async (req: Request, res: Response) => {
    const { spaceId, participantId } = req.params;

    const space = await prisma.space.findUnique({
      where: { id: spaceId },
      include: {
        participants: true,
        Chat: true,
      },
    });

    if (!space) {
      throw new ApiError(404, "Space does not exist");
    }

    const alreadyAParticipant = space.participants.some((participant) => {
      return participant.userId === participantId;
    });

    if (alreadyAParticipant) {
      throw new ApiError(400, "Participant already in the space.");
    }

    await prisma.userSpace.create({
      data: {
        userId: participantId,
        spaceId: spaceId,
      },
    });

    if (space.Chat) {
      await prisma.chat.update({
        where: { id: space.Chat.id },
        data: {
          participants: {
            connect: {
              id: participantId,
            },
          },
        },
      });
    }

    const updatedSpace = await prisma.space.findUnique({
      where: { id: spaceId },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                fullname: true,
                avatar: {
                  select: {
                    imageURL: true,
                  },
                },
              },
            },
          },
          orderBy: {
            joinedAt: "asc",
          },
        },
      },
    });

    if (!updatedSpace) {
      throw new ApiError(400, "Unable to add user to space.");
    }

    updatedSpace.participants.forEach((participant) => {
      if (participant.userId === req.user?.id) return;

      emitSocketEvent(
        req,
        participant.userId,
        SocketEventEnum.JOIN_SPACE_EVENT,
        space
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

const removeParticipantFromSpace = asyncHandler(
  async (req: Request, res: Response) => {
    const { spaceId, participantId } = req.params;

    if (req.user?.id !== participantId) {
      throw new ApiError(400, "You are not authorized to remove another user.");
    }

    const space = await prisma.space.findUnique({
      where: {
        id: spaceId,
      },
      include: {
        participants: true,
        Chat: true,
      },
    });

    if (!space) {
      throw new ApiError(404, "Space does not exist");
    }

    const isParticipant = space.participants.some(
      (participant) => participant.userId === participantId
    );

    if (!isParticipant) {
      throw new ApiError(400, "Participant does not exist in the space");
    }

    await prisma.userSpace.delete({
      where: {
        userId_spaceId: {
          userId: participantId,
          spaceId,
        },
      },
    });

    const updatedSpace = await prisma.space.update({
      where: {
        id: spaceId,
      },
      data: {
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
            user: {
              select: {
                id: true,
                username: true,
                email: true,
                fullname: true,
                avatar: {
                  select: {
                    imageURL: true,
                  },
                },
              },
            },
          },
          orderBy: {
            joinedAt: "asc",
          },
        },
      },
    });

    if (!updatedSpace) {
      throw new ApiError(500, "Unable to remove user from space.");
    }

    updatedSpace.participants.forEach((participant) => {
      // if (participant.user.id === req.user?.id) return;

      emitSocketEvent(
        req,
        participant.user.id,
        SocketEventEnum.LEAVE_SPACE_EVENT,
        updatedSpace
      );
    });

    return res
      .status(200)
      .json(new ApiResponse(200, updatedSpace, "Player removed successfully"));
  }
);

const getSpaceDetails = asyncHandler(async (req: Request, res: Response) => {
  const { spaceId } = req.params;

  const space = await prisma.space.findUnique({
    where: {
      id: spaceId,
    },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: {
                select: {
                  imageURL: true,
                },
              },
              email: true,
              fullname: true,
            },
          },
        },
        orderBy: {
          joinedAt: "asc",
        },
      },
    },
  });

  if (!space) {
    throw new ApiError(404, "Space does not exist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, space, "Space fetched successfully"));
});

const getUsersInSpace = asyncHandler(async (req: Request, res: Response) => {
  const { spaceId } = req.params;

  const usersInSpace = await prisma.userSpace.findMany({
    where: {
      spaceId: spaceId,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          fullname: true,
          avatar: {
            select: {
              imageURL: true,
            },
          },
        },
      },
    },
    orderBy: {
      joinedAt: "asc",
    },
  });

  if (!usersInSpace) {
    throw new ApiError(404, "Space does not exist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, usersInSpace, "Space fetched successfully"));
});

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
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: {
                select: {
                  imageURL: true,
                },
              },
              email: true,
              fullname: true,
            },
          },
        },
        orderBy: {
          joinedAt: "asc",
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
      participant.user.id,
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

const endSpace = asyncHandler(async (req: Request, res: Response) => {
  const { spaceId } = req.params;

  const space = await prisma.space.findUnique({
    where: {
      id: spaceId,
    },
  });

  if (!space) {
    throw new ApiError(404, "Space does not exist");
  }

  const deletedSpace = await prisma.space.delete({
    where: {
      id: spaceId,
    },
    include: {
      participants: {
        select: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              fullname: true,
              avatar: {
                select: {
                  imageURL: true,
                },
              },
            },
          },
        },
        orderBy: {
          joinedAt: "asc",
        },
      },
    },
  });

  if (!deletedSpace) {
    throw new ApiError(500, "Unable to end space.");
  }

  deletedSpace.participants.forEach((participant) => {
    emitSocketEvent(req, participant.user.id, SocketEventEnum.END_SPACE, null);
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Space ended successfully"));
});

export {
  addNewParticipantToSpace,
  createASpace,
  getSpaceDetails,
  removeParticipantFromSpace,
  renameSpace,
  getUsersInSpace,
  endSpace,
};
