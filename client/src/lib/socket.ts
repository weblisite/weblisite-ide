import { io } from "socket.io-client";

// Initialize socket connection with auto-reconnect settings
export const socket = io({
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000
});

// Setup basic connection event handlers
socket.on('connect', () => {
  console.log('Socket connected');
});

socket.on('disconnect', (reason) => {
  console.log('Socket disconnected:', reason);
});

socket.on('reconnect', (attemptNumber) => {
  console.log(`Socket reconnected after ${attemptNumber} attempts`);
});

socket.on('reconnect_error', (error) => {
  console.error('Socket reconnection error:', error);
});

socket.on('reconnect_failed', () => {
  console.error('Socket reconnection failed after multiple attempts');
});
