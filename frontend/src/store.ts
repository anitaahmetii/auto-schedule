import { configureStore } from '@reduxjs/toolkit';
import notificationsReducer from './Services/notificationsSlice';

export const store = configureStore({
  reducer: {
    notifications: notificationsReducer, // <- your notifications slice
  },
});

export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof store.getState>; // 👈 This replaces RootState
