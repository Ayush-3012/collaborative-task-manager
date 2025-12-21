import { useEffect, useState } from "react";
import {
  fetchNotifications,
  markNotificationAsRead,
  type Notification,
} from "../api/notification.api";
import { connectSocket } from "../socket";
import { useAuth } from "./useAuth";
import { useSnackbar } from "notistack";

export const useNotification = () => {
  const { user, isAuthenticated } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchAllNotification = async () => {
      try {
        const data = await fetchNotifications();
        setNotifications(data);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllNotification();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    const socket = connectSocket();

    const handleTaskAssigned = (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);

      enqueueSnackbar(notification.message, {
        variant: "info",
      });
    };

    socket.on("task-assigned", handleTaskAssigned);

    return () => {
      socket.off("task-assigned", handleTaskAssigned);
    };
  }, [isAuthenticated, user?.id, enqueueSnackbar]);

  const markAsRead = async (id: string) => {
    try {
      const updated = await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === updated.id ? updated : n))
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
  };
};
