import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL,
    timeout: 10000,
});

// Bare client for auth recovery (no interceptors)
const authClient = axios.create({
    baseURL,
    timeout: 10000
});

// Retry logic for failed requests
const retryConfig = {
    maxRetries: 3,
    retryDelay: 1000, // 1 second initially
    retryableStatuses: [408, 429, 500, 502, 503, 504]
};

// Response interceptor with retry logic
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error.config;

        // Initialize retry count
        if (!config) {
            return Promise.reject(error);
        }

        config.retryCount = config.retryCount || 0;

        // Check if request is retryable
        const isNetworkError = !error.response;
        const isRetryableStatus = error.response && retryConfig.retryableStatuses.includes(error.response.status);
        const shouldRetry = (isNetworkError || isRetryableStatus) && config.retryCount < retryConfig.maxRetries;

        if (shouldRetry) {
            config.retryCount++;
            const delay = retryConfig.retryDelay * Math.pow(2, config.retryCount - 1); // Exponential backoff
            
            console.warn(
                `🔄 API request failed (${config.retryCount}/${retryConfig.maxRetries}). Retrying in ${delay}ms...`,
                error.message
            );

            await new Promise(resolve => setTimeout(resolve, delay));
            return api(config);
        }

        // Handle 401 errors
        if (error.response && error.response.status === 401 && config) {
            const isDemoEnabled =
                String(process.env.REACT_APP_ENABLE_DEMO_LOGIN || '').toLowerCase() === 'true';

            const url = String(config.url || '');
            const isAuthRequest = url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/demo-login');

            // In dev/in-memory mode the backend can restart and wipe users.
            // If demo login is enabled, recover once by getting a fresh token and retrying the original request.
            if (isDemoEnabled && !isAuthRequest && !config.__retriedAfterDemoLogin) {
                config.__retriedAfterDemoLogin = true;
                try {
                    const res = await authClient.post('/auth/demo-login');
                    const token = res?.data?.token;
                    if (token) {
                        localStorage.setItem('token', token);
                        window.dispatchEvent(new Event('auth:updated'));
                        config.headers = config.headers || {};
                        config.headers.Authorization = `Bearer ${token}`;
                        return api(config);
                    }
                } catch (_) {
                    // fall through to token cleanup
                }
            }

            localStorage.removeItem('token');
        }

        return Promise.reject(error);
    }
);

// Request interceptor - attach token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;