import { io, Socket } from 'socket.io-client';

// Both customer AND partner connect to the user backend (port 3001)
const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

let socket: Socket | null = null;

/**
 * Get or create Socket.IO client instance
 * Connects to user backend (port 3001) for both customer and partner
 * @returns Socket.IO client instance
 */
export function getSocket(): Socket {
    if (!socket) {

        socket = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000, // Start with 1 second
            reconnectionDelayMax: 5000, // Max 5 seconds between attempts
            reconnectionAttempts: Infinity, // Keep trying indefinitely
            timeout: 20000, // Connection timeout
            autoConnect: true,
            // Enable connection state recovery
            withCredentials: true,
        });

        // Connection event handlers
        socket.on('connect', () => {
            console.log('[Socket.IO] Connected to server');
        });

        socket.on('disconnect', (reason) => {
            console.log('[Socket.IO] Disconnected:', reason);
            // If disconnected due to server restart or transport close, reconnect
            if (reason === 'io server disconnect' && socket) {
                // Server disconnected the socket, reconnect manually
                socket.connect();
            }
        });

        socket.on('connect_error', (error) => {
            console.error('[Socket.IO] Connection error:', error.message);
        });

        socket.on('reconnect_attempt', (attemptNumber) => {
            console.log(`[Socket.IO] Reconnection attempt ${attemptNumber}`);
        });

        socket.on('reconnect', (attemptNumber) => {
            console.log(`[Socket.IO] Reconnected after ${attemptNumber} attempts`);
        });

        socket.on('reconnect_failed', () => {
            console.error('[Socket.IO] Reconnection failed - will keep trying');
        });

        socket.on('reconnect_error', (error) => {
            console.error('[Socket.IO] Reconnection error:', error.message);
        });

    }
    return socket;
}

/**
 * Disconnect and cleanup Socket.IO client
 */
export function disconnectSocket(): void {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}
