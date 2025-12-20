import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import * as authApi from "../api/auth.api";

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  const { user, setUser, isLoading, setIsLoading } = ctx;

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await authApi.getMe();
        setUser(res.user);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMe();
  }, [setIsLoading, setUser]);

  const login = async (data: { email: string; password: string }) => {
    const res = await authApi.login(data);
    setUser(res.user.id);
    return res;
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    await authApi.register(data);
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  const update = async (data: { name: string }) => {
    const res = await authApi.updateProfile(data);
    return res;
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    updateProfile: update,
    logout,
  };
};
