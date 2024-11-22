/* eslint-disable @typescript-eslint/no-explicit-any */

import { AxiosResponse } from "axios";
import {
  APIStatusResponseInterface,
  ChatItemInterface,
  UserInterface,
} from "../types/chat";

export const isBrowser = typeof window !== "undefined";

export class LocalStorage {
  static get(key: string) {
    if (!isBrowser) return;
    const value = localStorage.getItem(key);
    if (value) {
      try {
        return JSON.parse(value);
      } catch (err) {
        return null;
      }
    }
    return null;
  }

  static set(key: string, value: any) {
    if (!isBrowser) return;
    localStorage.setItem(key, JSON.stringify(value));
  }

  static remove(key: string) {
    if (!isBrowser) return;
    localStorage.removeItem(key);
  }

  static clear() {
    if (!isBrowser) return;
    localStorage.clear();
  }
}

export const fetcher = async (
  api: () => Promise<AxiosResponse<APIStatusResponseInterface, any>>
): Promise<{
  data: APIStatusResponseInterface | null;
  error: string | null;
  isLoading: boolean;
}> => {
  let data: APIStatusResponseInterface | null = null;
  let error: string | null = null;
  let isLoading: boolean = true;

  try {
    const response = await api();
    data = response.data;

    // console.log(data);
  } catch (err: any) {
    // console.log(err?.response?.data);

    error = (err?.response?.data.message as string) || "An error occurred";
  } finally {
    isLoading = false;
  }

  return { data, error, isLoading };
};

export const getUserMetadata = (
  chat: ChatItemInterface,
  loggedInUser: UserInterface
) => {
  const player = chat.participants.find((p) => p.id !== loggedInUser?.id);
  console.log(player);

  return {
    avatar: player?.avatar,
    title: player?.username,
    description: player?.email,
  };
};

// export const getChatObjectMetadata = (
//   chat: ChatItemInterface,
//   loggedInUser: UserInterface
// ) => {
//   const lastMessage = chat.lastMessage?.content
//     ? chat.lastMessage?.content
//     :  "No messages yet"

//   if (chat.isGroupGame) {
//     return {
//       avatar: "https://via.placeholder.com/100x100.png",
//       title: chat.name,
//       description: `${chat.players.length} members in the chat`,
//       lastMessage: chat.lastMessage
//         ? chat.lastMessage?.sender?.username + ": " + lastMessage
//         : lastMessage,
//     };
//   } else {
//     const player = chat.players.find(
//       (p) => p.id !== loggedInUser?.id
//     );

//     return {
//       avatar: player?.avatar,
//       title: player?.username,
//       description: player?.email,
//       lastMessage,
//     };
//   }
// };
