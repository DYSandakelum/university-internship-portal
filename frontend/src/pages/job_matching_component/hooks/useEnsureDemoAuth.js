import { useEffect, useState } from 'react';

import api from '../../../services/api';

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

            // Only try demo-login when explicitly enabled.
            // Implicit demo-login in development can silently switch accounts and make saved jobs
            // appear to "disappear" after re-login.
            const demoEnabled = String(process.env.REACT_APP_ENABLE_DEMO_LOGIN || '').toLowerCase() === 'true';

            if (!demoEnabled) {
                if (!cancelled) setReady(true);
                return;
            }

            try {
                const res = await api.post('/auth/demo-login');
                const token = res?.data?.token;
                if (token) {
                    localStorage.setItem('token', token);
                    // Notify AuthContext to refresh `/auth/me` and populate `user`.
                    window.dispatchEvent(new Event('auth:updated'));
                    if (!cancelled) setReady(true);
                    return;
                }
                throw new Error('Missing token');
            } catch (e) {
                if (!cancelled) {
                    // If demo-login isn't available (404), proceed without a token.
                    if (e?.response?.status === 404) {
                        setReady(true);
                        return;
                    }

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
