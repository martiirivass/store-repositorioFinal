import { create } from "zustand";
import { api } from "../shared/api";

interface User {
  id: number;
  nombre: string;
  email: string;
  roles: { codigo: string; nombre: string }[];
}

interface AuthStore {
  user: User | null;
  isLogged: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (nombre: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLogged: false,
  isLoading: true,

  checkAuth: async () => {
    try {
      const { data } = await api.get("/auth/me");
      set({ user: data, isLogged: true, isLoading: false });
    } catch {
      set({ user: null, isLogged: false, isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    await api.post("/auth/login", { email, password });
    const { data } = await api.get("/auth/me");
    set({ user: data, isLogged: true });
  },

  register: async (nombre: string, email: string, password: string) => {
    await api.post("/auth/register", { nombre, email, password });
    await api.post("/auth/login", { email, password });
    const { data } = await api.get("/auth/me");
    set({ user: data, isLogged: true });
  },

  logout: async () => {
    try { await api.post("/auth/logout"); } catch {}
    set({ user: null, isLogged: false });
  },
}));
