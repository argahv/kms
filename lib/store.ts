import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";

interface AuthState {
  isAppReady: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAppReady: false,
      user: {
        role: "" as any,
      } as User,
      setUser: (user) => set({ user, isAppReady: true }),
      logout: () => set({ user: null, isAppReady: true }),
    }),
    {
      name: "auth-storage",
    }
  )
);
