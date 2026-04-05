import api from './api';

export const getNotifications = async () => {
    const response = await api.get('/notifications');
    return response.data.notifications;
};

export const updateNotificationSettings = async (settings) => {
    const response = await api.put('/notifications/settings', settings);
    return response.data.notificationSettings;
};
