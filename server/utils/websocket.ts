import { Server } from 'http';
import { Server as SocketIOServer } from 'socket.io';

// Keep track of active socket server instance
let io: SocketIOServer | null = null;

/**
 * Initialize the WebSocket server
 */
export function initializeWebSocketServer(server: Server) {
  io = new SocketIOServer(server);
  
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
  
  return io;
}

/**
 * Get the socket server instance
 * Returns null if the server is not initialized instead of throwing
 */
export function getSocketServer() {
  return io;
}

/**
 * Emit a file creation event
 */
export function emitFileCreated(file: { path: string; name: string }) {
  if (!io) return;
  
  io.emit('file-created', file);
}

/**
 * Emit a file content chunk event
 */
export function emitFileContent(path: string, chunk: string) {
  if (!io) return;
  
  io.emit('file-content', { path, chunk });
}

/**
 * Emit a file generated event
 */
export function emitFileGenerated(path: string) {
  if (!io) return;
  
  io.emit('file-generated', path);
}

/**
 * Emit a generation complete event
 */
export function emitGenerationComplete() {
  if (!io) return;
  
  io.emit('generation-complete');
}

/**
 * Emit a preview ready event
 */
export function emitPreviewReady(url: string) {
  if (!io) return;
  
  io.emit('preview-ready', url);
}
