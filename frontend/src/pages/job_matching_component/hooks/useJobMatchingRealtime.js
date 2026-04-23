import { useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const resolveRealtimeBaseUrl = () => {
    const apiBase = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
    return apiBase.replace(/\/api\/?$/i, '');
};

export default function useJobMatchingRealtime(onDataChanged) {
    const [connected, setConnected] = useState(false);
    const callbackRef = useRef(onDataChanged);

    useEffect(() => {
        callbackRef.current = onDataChanged;
    }, [onDataChanged]);

    const baseUrl = useMemo(resolveRealtimeBaseUrl, []);

    useEffect(() => {
        const token = localStorage.getItem('token') || '';

        const socket = io(baseUrl, {
            transports: ['websocket', 'polling'],
            auth: token ? { token } : {}
        });

        socket.on('connect', () => setConnected(true));
        socket.on('disconnect', () => setConnected(false));

        socket.on('job-matching:data-changed', (packet) => {
            if (typeof callbackRef.current === 'function') {
                callbackRef.current(packet);
            }
        });

        return () => {
            socket.disconnect();
            setConnected(false);
        };
    }, [baseUrl]);

    return { connected };
}
