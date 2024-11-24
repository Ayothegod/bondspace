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
