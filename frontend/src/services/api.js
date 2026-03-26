import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
    timeout: 10000,
});

const retryConfig = {
    maxRetries: 3,
    retryDelay: 1000,
    retryableStatuses: [408, 429, 500, 502, 503, 504],
};

// Handle expired or invalid token responses + retry transient failures
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error.config;

        if (config) {
            config.retryCount = config.retryCount || 0;

            const isNetworkError = !error.response;
            const isRetryableStatus =
                error.response && retryConfig.retryableStatuses.includes(error.response.status);
            const shouldRetry =
                (isNetworkError || isRetryableStatus) && config.retryCount < retryConfig.maxRetries;

            if (shouldRetry) {
                config.retryCount += 1;
                const delay = retryConfig.retryDelay * Math.pow(2, config.retryCount - 1);
                await new Promise((resolve) => setTimeout(resolve, delay));
                return api(config);
            }
        }

        return Promise.reject(error);
    }
);

// Automatically attach token to every request if it exists
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