/* eslint-disable @typescript-eslint/no-explicit-any */

import { AxiosResponse } from "axios";
import { APIStatusResponseInterface, ChatListItemInterface, UserInterface } from "../types/chat";

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

export const requestHandler = async (
  api: () => Promise<AxiosResponse<APIStatusResponseInterface, any>>,
  setLoading: ((loading: boolean) => void) | null,
  onSuccess: (data: APIStatusResponseInterface) => void,
  onError: (error: string) => void
) => {
  setLoading && setLoading(true);

  try {
    const response = await api();

    const { data } = response;
    if (data?.success) {
      onSuccess(data);
    }
  } catch (error: any) {
    onError(error?.response?.data?.message || "Something went wrong");
  } finally {
    setLoading && setLoading(false);
  }
};

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

export const getChatObjectMetadata = (
  chat: ChatListItemInterface, 
  loggedInUser: UserInterface 
) => {
  const lastMessage = chat.lastMessage?.content
    ? chat.lastMessage?.content
    :  "No messages yet"

  if (chat.isGroupGame) {
    return {
      avatar: "https://via.placeholder.com/100x100.png",
      title: chat.name, 
      description: `${chat.players.length} members in the chat`,
      lastMessage: chat.lastMessage
        ? chat.lastMessage?.sender?.username + ": " + lastMessage
        : lastMessage,
    };
  } else {
    const player = chat.players.find(
      (p) => p.id !== loggedInUser?.id
    );

    return {
      avatar: player?.avatarId, 
      title: player?.username, 
      description: player?.email,
      lastMessage,
    };
  }
};