import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "../services/authService";
import type { User } from "../services/authService";

interface AuthStore {
  user: User | null;
  isLogged: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (nombre: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLogged: false,
      isLoading: true,
      accessToken: null,

      checkAuth: async () => {
        try {
          const { user, accessToken } = await authService.checkAuth();
          set({ user, isLogged: true, isLoading: false, accessToken });
        } catch {
          set({ user: null, isLogged: false, isLoading: false });
        }
      },

      login: async (email: string, password: string) => {
        const { user, accessToken } = await authService.login(email, password);
        set({ user, isLogged: true, accessToken });
      },

      register: async (nombre: string, email: string, password: string) => {
        const { user, accessToken } = await authService.register(nombre, email, password);
        set({ user, isLogged: true, accessToken });
      },

      logout: async () => {
        try { await authService.logout(); } catch {}
        set({ user: null, isLogged: false, accessToken: null });
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({ user: state.user, isLogged: state.isLogged, accessToken: state.accessToken }),
    }
  )
);
