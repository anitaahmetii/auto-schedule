import * as signalR from '@microsoft/signalr';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { addNotification } from './notificationsSlice';
import { store } from '../store';

let connection: signalR.HubConnection | null = null;

export const startNotificationConnection = async (
  onMessage: (message: string) => void,
  token: string
) => {
  if (connection) return; // avoid duplicate connections

  connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7085/notificationHub", {
      accessTokenFactory: () => token,
      withCredentials: true,
    })
    .withAutomaticReconnect()
    .build();

  connection.on("ReceiveNotification", onMessage);

  try {
  await connection.start();
  console.log("✅ SignalR connected!");
} catch (err) {
  console.error("❌ SignalR connection error:", err);
}

  return connection;
};