import { useEffect, useRef } from 'react';
import { getSocket } from '../lib/socket';

interface RequestUpdatePayload {
    requestId: number;
    status?: string;
    schedule_time?: string;
    status_message?: string;
    cancel_reason?: string;
    timestamp: string;
}

export function useRequestRealtime(
    requestId: number | null,
    onUpdate: (payload: RequestUpdatePayload) => void
) {
    const socketRef = useRef(getSocket());
    const onUpdateRef = useRef(onUpdate);

    // Keep onUpdate ref current
    useEffect(() => {
        onUpdateRef.current = onUpdate;
    }, [onUpdate]);

    useEffect(() => {
        if (requestId === null) {
            return;
        }
        const socket = socketRef.current;

        // Function to join room (reusable for initial join and reconnection)
        const joinRoom = () => {
            socket.emit('join_request_room', { requestId });
        };

        // Join request room initially
        joinRoom();

        // Listen for updates
        const handleUpdate = (payload: RequestUpdatePayload) => {
            if (payload.requestId === requestId) {
                onUpdateRef.current(payload);
            }
        };

        socket.on('requestUpdated', handleUpdate);

        // Rejoin room on reconnection
        const handleReconnect = () => {
            console.log(`[useRequestRealtime] Reconnected, rejoining room for request ${requestId}`);
            joinRoom();
        };

        socket.on('reconnect', handleReconnect);

        // Confirm room joined
        // socket.on('request_room_joined', () => { });


        // Cleanup
        return () => {
            socket.off('requestUpdated', handleUpdate);
            socket.off('reconnect', handleReconnect);
            socket.off('request_room_joined');
            socket.emit('leave_request_room', { requestId });
        };
    }, [requestId]);
}
