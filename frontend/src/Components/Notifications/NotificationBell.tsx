import { useSelector } from 'react-redux';
import { AppState } from '../../store';

const NotificationBell = () => {
  const notifications = useSelector((state: AppState) => state.notifications);
  const user = JSON.parse(localStorage.getItem("userModel") || "{}");

  const myNotifications = notifications.filter(n => n.userId === user.id);
  const unreadCount = myNotifications.filter(n => !n.isRead).length;

  return (
    <div className="relative cursor-pointer">
      🔔
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
          {unreadCount}
        </span>
      )}
    </div>
  );
};
export default NotificationBell;