import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ChatListItemInterface, UserInterface } from "@/lib/types/chat";

interface authStore {
  user: UserInterface | null;
  token: string | null;
  setUser: (user?: UserInterface) => void;
  setToken: (token?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<authStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) =>
        set(() => {
          return { user: user };
        }),
      setToken: (token) => set(() => ({ token: token })),
      logout: () =>
        set((state) => {
          console.log("logout cicked!");

          if (state.token || state.user) {
            return { token: null, user: null };
          }
          return { token: null, user: null };
          // return state;
        }),
    }),
    {
      name: "chat-data",
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
}

// WARN: conver setChats to switch case type - maybe?
export const useChatStore = create<chatStore>((set) => ({
  allChats: [],
  setChats: (updateType, chat, chats, chatId) =>
    set((state) => {
      if (updateType === "addChat" && chat) {
        return { chats: [...state.allChats, chat] };
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

// interface messageStore {
//   isMessage: boolean;
//   setIsMessage: () => void;
// }

// export const useMessageStore = create<messageStore>((set) => ({
//   isMessage: false,
//   setIsMessage: () => set((state) => ({ isMessage: !state.isMessage })),
// }));

// export const useGetJobData = create<JobData>()(
//   persist(
//     (set, get) => ({
//       jobTitle: "",
//       jobDescription: "",
//       duration: 1,
//       amount: 1,
//       requiredSkills: [],  // Initialize as an empty array
//       jobLocation: "",
//       setJobTitle: (title) => set({ jobTitle: title }),
//       setJobDescription: (description) => set({ jobDescription: description }),
//       setAmount: (amount) => set({ amount: amount }),
//       setDuration: (duration) => set({ duration: duration }),
//       setJobLocation: (location) => set({ jobLocation: location }),
//       setRequiredSkills: (skill) =>
//         set((state) => {
//           if (!state.requiredSkills.includes(skill)) {
//             return { requiredSkills: [...state.requiredSkills, skill] };
//           }
//           return state;
//         }),
//       removeSkill: (skill) =>
//         set((state) => ({
//           requiredSkills: state.requiredSkills.filter((s) => s !== skill),
//         })),
//       getRequiredSkills: () => get().requiredSkills,
//     }),
//     {
//       name: "new-job-data",
//     }
//   )
// );

// // Create the Zustand store with localStorage persistence
// export const useStateStore = create<LoadingState>()(
//   persist(
//     (set) => ({
//       hasClaimed: false,
//       userType: "",
//       setHasClaimed: () => set({ hasClaimed: true }),
//       setUserType: (type) => set({ userType: type }),
//     }),
//     {
//       name: "claimed-token",
//     }
//   )
// );
