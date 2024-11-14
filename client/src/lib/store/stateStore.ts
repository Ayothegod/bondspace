import { create } from "zustand";

interface LoadingState {
  active: boolean;
  setActive: () => void;
}

export const useProcessStore = create<LoadingState>((set) => ({
  active: false,
  setActive: () => set((state) => ({ active: !state.active })),
}));
