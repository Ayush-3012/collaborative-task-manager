import { useEffect, useState } from "react";
import {
  fetchNotifications,
  markNotificationAsRead,
  type Notification,
} from "../api/notification.api"
import { connectSocket } from "../socket";

export const useNotification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchNotifications();
        setNotifications(data);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    const socket = connectSocket();

    socket.on("task-assigned", (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.off("task-assigned");
    };
  }, []);

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

  const unreadCount = notifications?.filter((n) => !n.read)?.length;

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
  };
};
