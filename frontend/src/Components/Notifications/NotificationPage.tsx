import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '../../store';
import { markAllAsRead, clearNotifications } from '../../Services/notificationsSlice';
import { Fragment } from 'react/jsx-runtime';

const NotificationPage = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state: AppState) => state.notifications);
  const user = JSON.parse(localStorage.getItem("userModel") || "{}");

  const myNotifications = notifications.filter(n => n.userId === user.id);

  return (
    <Fragment>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
        <button onClick={() => dispatch(markAllAsRead())} className="mr-2 btn btn-sm btn-primary">
          Mark all as read
        </button>
        <button onClick={() => dispatch(clearNotifications())} className="btn btn-sm btn-danger">
          Clear all
        </button>
        <ul className="mt-4">
          {myNotifications.map((n) => (
            <li key={n.id} className={`mb-3 p-3 rounded border ${n.isRead ? 'bg-gray-100' : 'bg-white shadow'}`}>
              <div>{n.message}</div>
              <div className="text-sm text-gray-500">{new Date(n.timestamp).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </div>
    </Fragment>
  );
};

export default NotificationPage;
