// DONE: query game
// const gameState = await prisma.game.findUnique({
//   where: {
//     id: gameId, // Provide the game ID to fetch
//   },
//   include: {
//     players: {
//       include: {
// User: {
//   select: {
//     email: true,
//     username: true,
//     id: true,
//     avatar: {
//       select: {
//         imageURL: true,
//       },
//     },
//     fullname: true,
//   },
// },
//         },
//       },
//     },
//     rounds: {
//       include: {
//         actions: true, // Example: Include actions or moves in each round
//       },
//       orderBy: {
//         startedAt: "asc",
//       },
//     },
//   },
// });

// {
//   "id": "gameId",
//   "status": "waiting",
//   "spaceId": "spaceId",
//   "players": [
//     {
//       "id": "playerId",
//       "User": {
//         "email": "user@example.com",
//         "username": "user123"
//       }
//     }
//   ],
//   "rounds": [
//     {
//       "id": "roundId",
//       "startedAt": "2024-11-23T12:00:00.000Z",
//       "actions": []
//     }
//   ]
// }





export const joinGame = async (req, res) => {
  const { gameId } = req.params;
  const { userId } = req.body;

  try {
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: { players: true },
    });

    if (game.players.length >= 6) {
      return res.status(400).json({ message: "Game is full, only 6 players allowed." });
    }

    const player = await prisma.player.create({
      data: {
        userId,
        gameId,
        chips: 1000,
      },
    });

    res.status(201).json({ message: "Player joined the game", player });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Start a game (ensure at least 2 players).
 */
export const startGame = async (req, res) => {
  const { gameId } = req.params;

  try {
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: { players: true },
    });

    if (game.players.length < 2) {
      return res.status(400).json({ message: "At least 2 players are required to start the game." });
    }

    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: { status: "ongoing", currentRound: 1 },
    });

    res.status(200).json({ message: "Game started", game: updatedGame });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * End a game.
 */
export const endGame = async (req, res) => {
  const { gameId } = req.params;

  try {
    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: { status: "finished" },
    });

    res.status(200).json({ message: "Game ended", game: updatedGame });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Start a round.
 */
export const startRound = async (req, res) => {
  const { gameId } = req.params;

  try {
    const game = await prisma.game.findUnique({ where: { id: gameId } });

    if (game.status !== "ongoing") {
      return res.status(400).json({ message: "Game must be ongoing to start a round." });
    }

    const newRound = await prisma.round.create({
      data: {
        gameId,
        roundNum: game.currentRound,
        status: "ongoing",
      },
    });

    res.status(201).json({ message: "Round started", round: newRound });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * End a round.
 */
export const endRound = async (req, res) => {
  const { gameId } = req.params;

  try {
    const round = await prisma.round.findFirst({
      where: { gameId, status: "ongoing" },
    });

    if (!round) {
      return res.status(404).json({ message: "No ongoing round found." });
    }

    await prisma.round.update({
      where: { id: round.id },
      data: { status: "finished", endedAt: new Date() },
    });

    await prisma.game.update({
      where: { id: gameId },
      data: { currentRound: { increment: 1 } },
    });

    res.status(200).json({ message: "Round ended" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Add an action to a round.
 */
export const addAction = async (req, res) => {
  const { roundId, gameId } = req.params;
  const { playerId, type, amount } = req.body;

  try {
    const round = await prisma.round.findFirst({ where: { id: roundId, gameId } });

    if (!round || round.status !== "ongoing") {
      return res.status(400).json({ message: "Invalid round or round not ongoing." });
    }

    const action = await prisma.action.create({
      data: {
        type,
        amount,
        playerId,
        roundId,
      },
    });

    res.status(201).json({ message: "Action added", action });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Handle player leaving a game.
 */
export const leaveGame = async (req, res) => {
  const { gameId } = req.params;
  const { playerId } = req.body;

  try {
    await prisma.player.delete({ where: { id: playerId } });

    const remainingPlayers = await prisma.player.findMany({ where: { gameId } });

    if (remainingPlayers.length < 2) {
      await prisma.game.update({
        where: { id: gameId },
        data: { status: "waiting" },
      });
    }

    res.status(200).json({ message: "Player left the game" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get game details.
 */
export const getGameDetails = async (req, res) => {
  const { gameId } = req.params;

  try {
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: {
        players: { include: { User: true } },
        rounds: true,
      },
    });

    res.status(200).json({ game });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};





model User {
  id            String         @id @default(uuid())
  username      String         @unique
  fullname      String
  email         String         @unique
  password      String
  createdAt     DateTime       @default(now())
  avatar        Avatar?
  spaces        UserSpace[]
  messages      Message[]
  notifications Notification[]
  sessions      Session[]
  chats         Chat[]
  games         Player[]
  score         Int            @default(0) // Tracks total score across games
}

model Space {
  id            String      @id @default(uuid())
  status        String      // "active", "inactive"
  participants  UserSpace[]
  spaceDuration DateTime?
  name          String
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  endedAt       DateTime?
  Chat          Chat?
  GamesSession  Game[]
  maxActiveGames Int        @default(1) // Limit active games in the space
}

model Game {
  id           String   @id @default(uuid())
  status       String   // "waiting", "ongoing", "finished"
  currentRound Int      @default(0) // Tracks the current round number
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  spaceId      String
  Space        Space    @relation(fields: [spaceId], references: [id], onDelete: Cascade)

  prizePool    Int      @default(0) // Chips/tokens for the game reward
  totalRounds  Int      @default(0) // Total rounds in the game
  finalStandings Json?  // JSON to store final results for players
  rounds       Round[]
  players      Player[]
  invitations  Invitation[]
}

model Player {
  id       String   @id @default(uuid())
  userId   String
  gameId   String
  Game     Game     @relation(fields: [gameId], references: [id], onDelete: Cascade)
  joinedAt DateTime @default(now())
  chips    Int      @default(1000) // Current chips
  totalChipsWon Int @default(0)    // Total chips won
  totalChipsLost Int @default(0)   // Total chips lost
  actions  Action[]
  User     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Round {
  id        String    @id @default(uuid())
  roundNum  Int       // The number of this round (e.g., 1, 2, 3)
  status    String    // "ongoing", "finished"
  startedAt DateTime  @default(now())
  endedAt   DateTime?
  timer     Int?      // Timer in seconds for the round
  gameId    String
  Game      Game      @relation(fields: [gameId], references: [id], onDelete: Cascade)
  actions   Action[]
}

model Action {
  id        String   @id @default(uuid())
  type      String   // "fold", "bet", "raise", "call", "check"
  amount    Int?     // Amount of chips (if applicable)
  createdAt DateTime @default(now())
  playerId  String
  roundId   String
  Player    Player   @relation(fields: [playerId], references: [id], onDelete: Cascade)
  Round     Round    @relation(fields: [roundId], references: [id], onDelete: Cascade)
}

model Invitation {
  id        String   @id @default(uuid())
  userId    String
  gameId    String
  status    String   // "pending", "accepted", "declined"
  createdAt DateTime @default(now())
  User      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  Game      Game     @relation(fields: [gameId], references: [id], onDelete: Cascade)
}





import { prisma } from "../prisma";

// Create a game
export const createGame = async (req, res) => {
  const { spaceId, prizePool } = req.body;

  // Check if space allows more games
  const activeGames = await prisma.game.count({
    where: { spaceId, status: "ongoing" },
  });
  const space = await prisma.space.findUnique({ where: { id: spaceId } });

  if (!space) return res.status(404).json({ message: "Space not found" });
  if (activeGames >= space.maxActiveGames)
    return res.status(400).json({ message: "Max active games reached for this space." });

  const newGame = await prisma.game.create({
    data: {
      spaceId,
      status: "waiting",
      prizePool: prizePool || 0,
    },
  });

  return res.status(201).json(newGame);
};

// Join a game
export const joinGame = async (req, res) => {
  const { gameId } = req.params;
  const { userId } = req.body;

  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: { players: true },
  });

  if (!game) return res.status(404).json({ message: "Game not found" });
  if (game.players.length >= 6)
    return res.status(400).json({ message: "Game is full." });

  const player = await prisma.player.create({
    data: {
      userId,
      gameId,
    },
  });

  return res.status(200).json(player);
};

// Start a game
export const startGame = async (req, res) => {
  const { gameId } = req.params;

  const game = await prisma.game.update({
    where: { id: gameId },
    data: { status: "ongoing" },
  });

  return res.status(200).json(game);
};

// End a game
export const endGame = async (req, res) => {
  const { gameId } = req.params;

  const game = await prisma.game.update({
    where: { id: gameId },
    data: { status: "finished", updatedAt: new Date() },
  });

  return res.status(200).json(game);
};
