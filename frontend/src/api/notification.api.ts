import { api } from "./axios";

export interface Notification {
  id: string;
  message: string;
  type: string;
  taskId: string;
  userId: string;
  read: boolean;
  createdAt: string;
}

export const fetchNotifications = async (): Promise<Notification[]> => {
  const res = await api.get("/notifications");
  return res.data.notifications;
};

export const markNotificationAsRead = async (
  notificationId: string
): Promise<Notification> => {
  const res = await api.patch(`/notifications/${notificationId}/read`);
  return res.data.notification;
};
