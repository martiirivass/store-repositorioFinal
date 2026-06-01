export interface User {
  id: number;
  nombre: string;
  email: string;
  roles: { codigo: string; nombre: string }[];
}

export interface AuthStore {
  user: User | null;
  isLogged: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (nombre: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
