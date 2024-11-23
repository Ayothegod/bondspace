import {
  SpaceInterface,
  UserInterface,
  ChatItemInterface,
  MessageInterface,
  UserProfile,
} from "@/lib/types/chat";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface authStore {
  user: UserInterface | null;
  setUser: (user?: UserInterface) => void;
  logout: () => void;
  clearUser: () => void;
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
          if (state.user) {
            return { user: null };
          }
          return { user: null };
          // return state;
        }),
      clearUser: () => set(() => ({ user: null })),
    }),
    {
      name: "auth-data",
    }
  )
);

interface userStore {
  userProfile: UserProfile | null;
  setUserProfile: (userProfile: UserProfile) => void;
  displayUserProfile: boolean;
  setDisplayUserProfile: () => void;
}

export const useUserStore = create<userStore>((set) => ({
  userProfile: null,
  setUserProfile: (userProfile) =>
    set(() => {
      return { userProfile: userProfile };
    }),
  displayUserProfile: false,
  setDisplayUserProfile: () =>
    set((state) => ({
      displayUserProfile: !state.displayUserProfile,
    })),
}));

interface spaceStore {
  space: SpaceInterface | null;
  setSpace: (
    updateType: "updateState" | "trial",
    space?: SpaceInterface
    // chatId?: string
  ) => void;
  clearSpace: () => void;
}

export const useSpaceStore = create<spaceStore>()(
  persist(
    (set) => ({
      space: null,
      setSpace: (updateType, space) =>
        set((state) => {
          if (updateType === "updateState" && space) {
            return { space: space };
          }
          return { space: state.space };
        }),
      clearSpace: () => set(() => ({ space: null })),
    }),
    {
      name: "active-space",
    }
  )
);

interface chatStore {
  chat: ChatItemInterface | null;
  setChat: (
    updateType: "updateChat" | "test",
    chat: ChatItemInterface
    // chatId?: string
  ) => void;
  creatingChat: boolean;
  setCreatingChat: () => void;
  clearChat: () => void;
}

// WARN: conver setChats to switch case type - maybe?
export const useChatStore = create<chatStore>((set) => ({
  creatingChat: false,
  setCreatingChat: () =>
    set((state) => ({ creatingChat: !state.creatingChat })),
  chat: null,
  setChat: (updateType, chat) =>
    set((state) => {
      if (updateType === "updateChat" && chat) {
        return { chat: chat };
      }
      return { chat: state.chat };
    }),
  clearChat: () => set(() => ({ chat: null })),
}));

interface messageStore {
  messages: MessageInterface[];
  setMessages: (
    updateType: "updateMessage" | "addMessage" | "deleteMessage",
    messages?: MessageInterface[],
    message?: MessageInterface
  ) => void;
}

// WARN: conver setChats to switch case type - maybe?
export const useMessageStore = create<messageStore>((set) => ({
  messages: [],
  setMessages: (updateType, messages, message) =>
    set((state) => {
      if (updateType === "updateMessage" && messages) {
        return { messages: messages };
      }
      if (updateType === "addMessage" && message) {
        return { messages: [...state.messages, message] };
      }
      if (updateType === "deleteMessage") {
        if (message) {
          return {
            messages: state.messages.filter((c) => c.id !== message.id),
          };
        }
        return { messages: state.messages };
      }
      return { messages: state.messages };
    }),
}));
