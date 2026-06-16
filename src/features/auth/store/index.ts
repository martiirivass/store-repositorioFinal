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

      checkAuth: async () => {
        try {
          const user = await authService.checkAuth();
          set({ user, isLogged: true, isLoading: false });
        } catch {
          set({ user: null, isLogged: false, isLoading: false });
        }
      },

      login: async (email: string, password: string) => {
        const user = await authService.login(email, password);
        set({ user, isLogged: true });
      },

      register: async (nombre: string, email: string, password: string) => {
        const user = await authService.register(nombre, email, password);
        set({ user, isLogged: true });
      },

      logout: async () => {
        try { await authService.logout(); } catch {}
        set({ user: null, isLogged: false });
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({ user: state.user, isLogged: state.isLogged }),
    }
  )
);
