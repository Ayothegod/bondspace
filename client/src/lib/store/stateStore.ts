import {
  ChatListItemInterface,
  SpaceInterface,
  UserInterface,
} from "@/lib/types/chat";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface authStore {
  user: UserInterface | null;
  setUser: (user?: UserInterface) => void;
  logout: () => void;
}

export const useAuthStore = create<authStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) =>
        set(() => {
          return { user: user };
        }),
      logout: () =>
        set((state) => {
          console.log("logout cicked!");

          if (state.user) {
            return { user: null };
          }
          return { user: null };
          // return state;
        }),
    }),
    {
      name: "auth-data",
    }
  )
);

interface spaceStore {
  space: SpaceInterface | null;
  setSpace: (
    updateType: string,
    space?: SpaceInterface
    // chatId?: string
  ) => void;
}

export const useSpaceStore = create<spaceStore>()(
  persist(
    (set) => ({
      space: null,
      setSpace: (updateType, space) =>
        set((state) => {
          if (updateType === "updateStore" && space) {
            return { space: space };
          }
          return { space: state.space };
        }),
    }),
    {
      name: "active-space",
    }
  )
);

interface chatStore {
  allChats: ChatListItemInterface[];
  setChats: (
    updateType: string,
    chat?: ChatListItemInterface,
    chats?: ChatListItemInterface[],
    chatId?: string
  ) => void;
  creatingChat: boolean;
  setCreatingChat: () => void;
}

// WARN: conver setChats to switch case type - maybe?
export const useChatStore = create<chatStore>((set) => ({
  creatingChat: false,
  setCreatingChat: () =>
    set((state) => ({ creatingChat: !state.creatingChat })),
  allChats: [],
  setChats: (updateType, chat, chats, chatId) =>
    set((state) => {
      if (updateType === "addChat" && chat) {
        return { allChats: [...state.allChats, chat] };
      }
      if (updateType === "updateChat" && chats) {
        // console.log("try from updateChat:", chats);
        return { allChats: chats };
      }
      if (updateType === "filterChat") {
        if (chat) {
          return { allChats: state.allChats.filter((c) => c.id !== chat.id) };
        } else {
          return { allChats: state.allChats.filter((c) => c.id !== chatId) };
        }
      }
      if (updateType === "updateChatLastMessage" && chat) {
        return {
          allChats: [chat, ...state.allChats.filter((c) => c.id !== chat.id)],
        };
      }
      if (updateType === "groupNameChange" && chat) {
        return {
          allChats: state.allChats.map((c) => {
            if (c.id === chat.id) {
              return chat;
            }
            return c;
          }),
        };
      }

      // console.log("Returned chats state:", state.chats);
      return { allChats: state.allChats };
    }),
}));
