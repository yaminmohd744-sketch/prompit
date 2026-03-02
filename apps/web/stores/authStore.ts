import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@prompit/types";
import { apiClient } from "@/lib/api";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshCredits: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      login: async (email, password) => {
        const { user, accessToken } = await apiClient.post("/auth/login", {
          email,
          password,
        });
        set({ user, accessToken, isAuthenticated: true });
      },

      register: async (name, email, password) => {
        const { user, accessToken } = await apiClient.post("/auth/register", {
          name,
          email,
          password,
        });
        set({ user, accessToken, isAuthenticated: true });
      },

      logout: async () => {
        try {
          await apiClient.post("/auth/logout", {});
        } finally {
          set({ user: null, accessToken: null, isAuthenticated: false });
        }
      },

      refreshCredits: async () => {
        const { credits } = await apiClient.get("/users/me/credits");
        const user = get().user;
        if (user) set({ user: { ...user, credits } });
      },
    }),
    {
      name: "prompit-auth",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
