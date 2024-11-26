/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Avatar {
  imageURL: string;
}

export interface UserInterface {
  id: string;
  avatar: Avatar;
  username: string;
  email: string;
  fullname?: string;
}

export interface UserProfile {
  id: string;
  avatar: Avatar;
  username: string;
  email: string;
  fullname: string;
}

export interface APIStatusResponseInterface {
  data: any;
  message: string;
  statusCode: number;
  success?: boolean;
}

export interface SpaceInterface {
  id: string;
  status: string;
  createdAt: Date;
  updatedAt: string;

  name: string;
  participants: UserInterface[];
}

export interface ChatItemInterface {
  id: string;
  status: boolean;
  createdAt: Date;
  updatedAt: string;

  name: string;
  spaceId: string;

  messages: MessageInterface[];
  participants: UserInterface[];
}

export interface MessageInterface {
  id: string;
  content: string;
  updatedAt: string;
  createdAt: string;
  chatId: string;
  senderId: string;
  sentiment?: string | null;
  sender: {
    id: string;
    username: string;
    email: string;
  };
}

// NOTE: create user response
// {
//   "statusCode": 200,
//   "data": {
//     "id": "504a7615-4b84-4726-8b1b-b8e984a2c7a6",
//     "email": "Tester@gmail.com",
//     "username": "Tester",
//     "avatar": null,
//     "fullname": "Tester Tester"
//   },
//   "message": "User registered successfully",
//   "success": true
// }

// NOTE: New create space response - space response
// {
//   "id": "a40dc86a-a819-4819-a4df-06c669a2e3ff",
//   "status": "started",
//   "spaceDuration": null,
//   "name": "Chilling Space with Gees",
//   "createdAt": "2024-11-23T11:17:56.524Z",
//   "updatedAt": "2024-11-23T11:17:56.524Z",
//   "endedAt": null,
//   "participants": [
//     {
//       "userId": "602b8b51-623a-4c8c-a12f-89e93d86711c",
//       "spaceId": "a40dc86a-a819-4819-a4df-06c669a2e3ff",
//       "joinedAt": "2024-11-23T11:17:56.726Z",
//       "user": {
//         "id": "602b8b51-623a-4c8c-a12f-89e93d86711c",
//         "username": "Player5",
//         "avatar": null,
//         "email": "Player5@gmail.com",
//         "fullname": "Player5 Tester"
//       }
//     }
//   ]
// },

// {
//   "statusCode": 200,
//   "data": {
//     "id": "a40dc86a-a819-4819-a4df-06c669a2e3ff",
//     "status": "started",
//     "spaceDuration": null,
//     "name": "Chilling Space with Gees",
//     "createdAt": "2024-11-23T11:17:56.524Z",
//     "updatedAt": "2024-11-23T11:17:56.524Z",
//     "endedAt": null,
//     "participants": [
//       {
//         "userId": "602b8b51-623a-4c8c-a12f-89e93d86711c",
//         "spaceId": "a40dc86a-a819-4819-a4df-06c669a2e3ff",
//         "joinedAt": "2024-11-23T11:17:56.726Z",
//         "user": {
//           "id": "602b8b51-623a-4c8c-a12f-89e93d86711c",
//           "username": "Player5",
//           "email": "Player5@gmail.com",
//           "fullname": "Player5 Tester",
//           "avatar": null
//         }
//       },
//       {
//         "userId": "504a7615-4b84-4726-8b1b-b8e984a2c7a6",
//         "spaceId": "a40dc86a-a819-4819-a4df-06c669a2e3ff",
//         "joinedAt": "2024-11-23T18:13:55.939Z",
//         "user": {
//           "id": "504a7615-4b84-4726-8b1b-b8e984a2c7a6",
//           "username": "Tester",
//           "email": "Tester@gmail.com",
//           "fullname": "Tester Tester",
//           "avatar": null
//         }
//       },
//       {
//         "userId": "54126682-c7eb-4d2c-a56d-522e3f036cea",
//         "spaceId": "a40dc86a-a819-4819-a4df-06c669a2e3ff",
//         "joinedAt": "2024-11-23T18:15:15.229Z",
//         "user": {
//           "id": "54126682-c7eb-4d2c-a56d-522e3f036cea",
//           "username": "Ayomide",
//           "email": "Ayomide@gmail.com",
//           "fullname": "TestAyomideer Tester",
//           "avatar": null
//         }
//       },
//       {
//         "userId": "6602a393-84da-4217-ba22-e9e6fd0b5e03",
//         "spaceId": "a40dc86a-a819-4819-a4df-06c669a2e3ff",
//         "joinedAt": "2024-11-23T18:19:51.776Z",
//         "user": {
//           "id": "6602a393-84da-4217-ba22-e9e6fd0b5e03",
//           "username": "Leagcy",
//           "email": "Leagcy@gmail.com",
//           "fullname": "Leagcy Tester",
//           "avatar": null
//         }
//       },
//       {
//         "userId": "af5151a9-73c0-458b-aaa5-1553cfddf1ee",
//         "spaceId": "a40dc86a-a819-4819-a4df-06c669a2e3ff",
//         "joinedAt": "2024-11-23T18:20:53.555Z",
//         "user": {
//           "id": "af5151a9-73c0-458b-aaa5-1553cfddf1ee",
//           "username": "Fourth",
//           "email": "Fourth@gmail.com",
//           "fullname": "Fourth Tester",
//           "avatar": null
//         }
//       }
//     ]
//   },
//   "message": "Participant added to space successfully.",
//   "success": true
// }

// NOTE: old addUserToSPace response - {space response}
// {
//   "statusCode": 200,
//   "data": {
//     "id": "e661f5ab-fc2e-438b-88a0-c5ddaaa20382",
//     "status": "started",
//     "spaceDuration": null,
//     "name": "Lets gooo",
//     "createdAt": "2024-11-21T01:45:53.652Z",
//     "updatedAt": "2024-11-22T23:10:07.609Z",
//     "endedAt": null,
//     "participants": [
//       {
//         "id": "c36b73e2-e841-493d-800c-8d47e074884b",
//         "username": "Ayomide",
//         "avatar": null,
//         "email": "ayodasilva12@gmail.com"
//       },
//       {
//         "id": "27337750-f642-4990-96e6-a6ebc21ebfb1",
//         "username": "itisAyomide12",
//         "avatar": null,
//         "email": "itisAyomide12@gmail.com"
//       },
//       {
//         "id": "99846ff9-6aa6-406e-8177-4483b31aca6c",
//         "username": "Tester",
//         "avatar": null,
//         "email": "Tester@gmail.com"
//       },
//       {
//         "id": "13b447bb-a23a-420d-a24a-80be753105b6",
//         "username": "Player1",
//         "avatar": null,
//         "email": "Player1@gmail.com"
//       },
//       {
//         "id": "d3517b45-bdc3-4e98-ae0c-c574dce77c0c",
//         "username": "Player2",
//         "avatar": null,
//         "email": "Player2@gmail.com"
//       },
//       {
//         "id": "76ee2dd9-00b0-4cdb-8e08-0749294bf775",
//         "username": "Player3",
//         "avatar": null,
//         "email": "Player3@gmail.com"
//       },
//       {
//         "id": "f55fe70d-ebb0-4f93-b53c-e3fb5d0087d2",
//         "username": "Player4",
//         "avatar": null,
//         "email": "Player4@gmail.com"
//       },
//       {
//         "id": "1146b805-01c8-40f8-b18e-7c6648e549a7",
//         "username": "Player5",
//         "avatar": null,
//         "email": "Player5@gmail.com"
//       }
//     ]
//   },
//   "message": "Participant added to space successfully.",
//   "success": true
// }

// NOTE: initila game - create game

// {
//   "statusCode": 201,
//   "data": {
//     "id": "6ff36b62-09d6-4d3c-8311-910c712703f9",
//     "status": "waiting",
//     "currentRound": 0,
//     "createdAt": "2024-11-24T01:46:02.681Z",
//     "updatedAt": "2024-11-24T01:46:02.681Z",
//     "spaceId": "1fcfcac9-64a8-404f-bbb8-5c5f6c8fa9b3",
//     "players": [
//       {
//         "id": "408c495b-a1ee-449c-b7b3-10a77eec05b4",
//         "userId": "af5151a9-73c0-458b-aaa5-1553cfddf1ee",
//         "gameId": "6ff36b62-09d6-4d3c-8311-910c712703f9",
//         "joinedAt": "2024-11-24T01:46:02.681Z",
//         "chips": 1000,
//         "User": {
//           "email": "Fourth@gmail.com",
//           "username": "Fourth",
//           "id": "af5151a9-73c0-458b-aaa5-1553cfddf1ee",
//           "avatar": null,
//           "fullname": "Fourth Tester"
//         }
//       }
//     ],
//     "rounds": []
//   },
//   "message": "Game created successfully",
//   "success": true
// }