
export interface NotificationModel {
  id: string;
  userId: string | null | undefined;
  message: string;
  timestamp: string;
  isRead: boolean;
}
