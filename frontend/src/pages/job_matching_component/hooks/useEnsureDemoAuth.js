import { useEffect, useState } from 'react';

import api from '../../../services/api';

export default function useEnsureDemoAuth() {
    const [ready, setReady] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;

        const ensure = async () => {
            const existingToken = localStorage.getItem('token');
            if (existingToken) {
                try {
                    await api.get('/auth/me');
                    if (!cancelled) {
                        setIsAuthenticated(true);
                        setReady(true);
                    }
                    return;
                } catch {
                    localStorage.removeItem('token');
                    window.dispatchEvent(new Event('auth:updated'));
                }
            }

            // Only try demo-login when explicitly enabled.
            // Implicit demo-login in development can silently switch accounts and make saved jobs
            // appear to "disappear" after re-login.
            const demoEnabled = String(process.env.REACT_APP_ENABLE_DEMO_LOGIN || '').toLowerCase() === 'true';

            if (!demoEnabled) {
                if (!cancelled) {
                    setIsAuthenticated(false);
                    setError('Please log in to access this page');
                    setReady(true);
                }
                return;
            }

            try {
                const res = await api.post('/auth/demo-login');
                const token = res?.data?.token;
                if (token) {
                    localStorage.setItem('token', token);
                    // Notify AuthContext to refresh `/auth/me` and populate `user`.
                    window.dispatchEvent(new Event('auth:updated'));
                    if (!cancelled) {
                        setIsAuthenticated(true);
                        setError('');
                        setReady(true);
                    }
                    return;
                }
                throw new Error('Missing token');
            } catch (e) {
                if (!cancelled) {
                    // If demo-login isn't available (404), proceed without a token.
                    if (e?.response?.status === 404) {
                        setIsAuthenticated(false);
                        setError('Please log in to access this page');
                        setReady(true);
                        return;
                    }

                    setIsAuthenticated(false);
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

    return { ready, isAuthenticated, error };
}
