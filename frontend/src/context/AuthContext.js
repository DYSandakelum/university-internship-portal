import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is already logged in when app loads
    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await api.get('/auth/me');
                    setUser(res.data.user);
                } catch (error) {
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    // Allow other parts of the app (e.g., demo-login) to trigger a refresh.
    useEffect(() => {
        let cancelled = false;

        const refresh = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setUser(null);
                return;
            }

            try {
                const res = await api.get('/auth/me');
                if (!cancelled) setUser(res.data.user);
            } catch (error) {
                if (!cancelled) {
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
        };

        const onAuthUpdated = () => {
            void refresh();
        };

        window.addEventListener('auth:updated', onAuthUpdated);
        window.addEventListener('storage', onAuthUpdated);

        return () => {
            cancelled = true;
            window.removeEventListener('auth:updated', onAuthUpdated);
            window.removeEventListener('storage', onAuthUpdated);
        };
    }, []);

    // Register
    const register = async (userData) => {
        const res = await api.post('/auth/register', userData);
        return res.data;
    };

    // Login
    const login = async (userData) => {
        const res = await api.post('/auth/login', userData);
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        return res.data;
    };

    // Demo Login (dev convenience)
    const demoLogin = async () => {
        const res = await api.post('/auth/demo-login');
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        // Keep other tabs / listeners in sync
        window.dispatchEvent(new Event('auth:updated'));
        return res.data;
    };

    // Logout
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            register,
            login,
            demoLogin,
            logout
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context easily
export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthContext;