import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
    timeout: 10000,
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
        if (error.response && error.response.status === 401) {
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