import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserInterface } from "@/lib/types/chat";

interface chatStore {
  active: boolean;
  setActive: () => void;
}

export const useChatStore = create<chatStore>((set) => ({
  active: false,
  setActive: () => set((state) => ({ active: !state.active })),
}));

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
          const name = "hello";
          console.log(name);

          return { user: user };
        }),
      setToken: (token) => set(() => ({ token: token })),
      logout: () =>
        set((state) => {
          if (state.token || state.user) {
            return { token: null, user: null };
          }
          return state;
        }),
    }),
    {
      name: "chat-data",
    }
  )
);

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
