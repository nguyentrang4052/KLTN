import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export function useJobsSocket(onNewJobs) {
    const socketRef = useRef(null);

    useEffect(() => {
        const socket = io('http://localhost:3000/jobs', {
            transports: ['websocket'],
            reconnectionDelay: 3000,
        });

        socketRef.current = socket;

        socket.on('new_jobs', ({ count }) => {
            onNewJobs(count);
        });

        return () => socket.disconnect();
    }, []);
}