import { createContext } from "react";

export type User = {
  id: string;
  name: string;
  email: string;
};

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setIsLoading: (value: boolean) => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);
