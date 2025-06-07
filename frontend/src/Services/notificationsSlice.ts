import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationModel } from '../Interfaces/NotificationModel';

const stored = localStorage.getItem('notifications');
const initialState: NotificationModel[] = stored ? JSON.parse(stored) : [];

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<NotificationModel>) => {
        const exists = state.some(n => n.id === action.payload.id);

        if (!exists) {
            state.unshift(action.payload);
        } else {
            console.log("⚠️ Duplicate notification skipped:", action.payload.id);
        }
    },
    markAllAsRead: (state) => {
        state.forEach(n => n.isRead = true);
    },
    clearNotifications: () => {
      return [];
    },
    setNotifications: (_state, action: PayloadAction<NotificationModel[]>) => {
      return action.payload;
    }
  },
});

export const { addNotification, markAllAsRead, clearNotifications, setNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
