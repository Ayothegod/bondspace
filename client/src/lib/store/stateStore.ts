import {
  SpaceInterface,
  UserInterface,
  ChatItemInterface,
  MessageInterface,
  // ChatMessageInterface
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
    updateType: "updateState" | "trial",
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
          if (updateType === "updateState" && space) {
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
  chat: ChatItemInterface | null;
  setChat: (
    updateType: "updateChat" | "test",
    chat: ChatItemInterface
    // chatId?: string
  ) => void;
  creatingChat: boolean;
  setCreatingChat: () => void;
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



  // const deleteChatMessage = async () => {
  // //   //ONClick delete the message and reload the chat when deleteMessage socket gives any response in chat.tsx
  // //   //use request handler to prevent any errors

  // //   await requestHandler(
  // //     async () => await deleteMessage(message.chat, message._id),
  // //     null,
  // //     (res) => {
  // //       setMessages((prev) => prev.filter((msg) => msg._id !== res.data._id));
  // //       updateChatLastMessageOnDeletion(message.chat, message);
  // //     },
  // //     alert
  // //   );
  // };

  // const handleOnMessageChange = () => {
  //   // // Update the message state with the current input value
  //   // setMessage(e.target.value);

  //   // // If socket doesn't exist or isn't connected, exit the function
  //   // if (!socket || !isConnected) return;

  //   // // Check if the user isn't already set as typing
  //   // if (!selfTyping) {
  //   //   // Set the user as typing
  //   //   setSelfTyping(true);

  //   //   // Emit a typing event to the server for the current chat
  //   //   socket.emit(TYPING_EVENT, currentChat.current?._id);
  //   // }

  //   // // Clear the previous timeout (if exists) to avoid multiple setTimeouts from running
  //   // if (typingTimeoutRef.current) {
  //   //   clearTimeout(typingTimeoutRef.current);
  //   // }

  //   // // Define a length of time (in milliseconds) for the typing timeout
  //   // const timerLength = 3000;

  //   // // Set a timeout to stop the typing indication after the timerLength has passed
  //   // typingTimeoutRef.current = setTimeout(() => {
  //   //   // Emit a stop typing event to the server for the current chat
  //   //   socket.emit(STOP_TYPING_EVENT, currentChat.current?._id);

  //   //   // Reset the user's typing state
  //   //   setSelfTyping(false);
  //   // }, timerLength);
  // };