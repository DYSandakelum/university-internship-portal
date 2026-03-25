import api from './api';

export const sendCareerChatMessage = async ({ message, context = {} }) => {
    const response = await api.post('/ai/chat', {
        message,
        context
    });

    return response.data;
};

export const aiChatService = {
    sendCareerChatMessage
};
