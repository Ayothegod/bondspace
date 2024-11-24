import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../utils/client.js";
import { SocketEventEnum } from "../utils/constants.js";
import { emitSocketEvent } from "../utils/socket.js";

const createGame = asyncHandler(async (req: Request, res: Response) => {
  const { spaceId } = req.body;

  const existingSpace = await prisma.space.findUnique({
    where: { id: spaceId },
  });

  if (!existingSpace) {
    throw new Error("Space not found");
  }

  const newGame = await prisma.game.create({
    data: {
      status: "waiting",
      spaceId,
      players: {
        create: {
          User: {
            connect: {
              id: req.user?.id,
            },
          },
        },
      },
    },
    include: {
      players: {
        include: {
          User: {
            select: {
              email: true,
              username: true,
              id: true,
              avatar: {
                select: {
                  imageURL: true,
                },
              },
              fullname: true,
            },
          },
        },
      },
      rounds: {
        include: {
          actions: true,
        },
        orderBy: {
          startedAt: "asc",
        },
      },
    },
  });

  if (!newGame) {
    throw new ApiError(404, "Error while creating game.");
  }

  newGame.players.forEach((player) => {
    if (player.User.id === req.user?.id) return;

    emitSocketEvent(
      req,
      player.User.id,
      SocketEventEnum.NEW_GAME_EVENT,
      newGame
    );
  });

  return res
    .status(200)
    .json(new ApiResponse(201, newGame, "Game created successfully"));
});

const joinGame = asyncHandler(async (req: Request, res: Response) => {
  const { gameId } = req.params;
  const { userId } = req.body;

  const existingGame = await prisma.game.findUnique({
    where: { id: gameId },
    include: { players: { include: { User: true } } },
  });

  if (!existingGame) {
    throw new Error("Game not found");
  }

  if (existingGame.players.length >= 6) {
    throw new Error("Game is full, only 6 players allowed");
  }

  const alreadyAParticipant = existingGame.players.some(
    (player) => player.User.id === userId
  );

  if (alreadyAParticipant) {
    throw new Error("Player is already in the game");
  }

  const player = await prisma.player.create({
    data: {
      userId,
      gameId,
      chips: 1000,
    },
  });

  const gameState = await prisma.game.findUnique({
    where: {
      id: gameId,
    },
    include: {
      players: {
        include: {
          User: {
            select: {
              email: true,
              username: true,
              id: true,
              avatar: {
                select: {
                  imageURL: true,
                },
              },
              fullname: true,
            },
          },
        },
      },
      rounds: {
        include: {
          actions: true,
        },
        orderBy: {
          startedAt: "asc",
        },
      },
    },
  });

  if (!gameState) {
    throw new ApiError(404, "Error while creating adding user to game.");
  }

  gameState.players.forEach((player) => {
    if (player.User.id === req.user?.id) return;

    emitSocketEvent(
      req,
      player.User.id,
      SocketEventEnum.JOIN_GAME_EVENT,
      gameState
    );
  });

  return res
    .status(200)
    .json(new ApiResponse(201, gameState, "Player joined the game"));
});

export { createGame, joinGame };
