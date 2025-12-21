import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import * as authApi from "../api/auth.api";
import { useSnackbar } from "notistack";

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  const { enqueueSnackbar } = useSnackbar();
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
    try {
      const res = await authApi.login(data);
      setUser(res.user);
      enqueueSnackbar("Login successful", { variant: "success" });
      return res;
    } catch (err) {
      enqueueSnackbar("Invalid email or password", { variant: "error" });
      throw err;
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      await authApi.register(data);
      enqueueSnackbar("Account created successfully", {
        variant: "success",
      });
    } catch (err) {
      enqueueSnackbar("Registration failed", { variant: "error" });
      throw err;
    }
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    enqueueSnackbar("Logged out", { variant: "info" });
  };

  const update = async (data: { name: string }) => {
    try {
      const res = await authApi.updateProfile(data);
      enqueueSnackbar("Profile updated", { variant: "success" });
      return res;
    } catch (err) {
      enqueueSnackbar("Failed to update profile", { variant: "error" });
      throw err;
    }
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
