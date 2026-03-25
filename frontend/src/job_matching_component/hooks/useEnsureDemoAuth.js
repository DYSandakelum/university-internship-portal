import { useEffect, useState } from 'react';

import api from '../../services/api';

export default function useEnsureDemoAuth() {
    const [ready, setReady] = useState(() => Boolean(localStorage.getItem('token')));
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;

        const ensure = async () => {
            if (localStorage.getItem('token')) {
                if (!cancelled) setReady(true);
                return;
            }

            try {
                const res = await api.post('/auth/demo-login');
                const token = res?.data?.token;
                if (token) {
                    localStorage.setItem('token', token);
                    if (!cancelled) setReady(true);
                    return;
                }
                throw new Error('Missing token');
            } catch (e) {
                if (!cancelled) {
                    setError(e?.response?.data?.message || 'Unable to start demo session');
                    setReady(true);
                }
            }
        };

        ensure();

        return () => {
            cancelled = true;
        };
    }, []);

    return { ready, error };
}
