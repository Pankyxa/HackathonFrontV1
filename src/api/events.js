import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Добавляем перехватчик для токена
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const eventsApi = {
    // Получить список всех событий
    async getEvents() {
        try {
            const response = await api.get('/events');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Получить активное событие
    async getActiveEvent() {
        try {
            const response = await api.get('/events/active');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Получить событие по ID
    async getEvent(eventId) {
        try {
            const response = await api.get(`/events/${eventId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Получить детальную информацию о событии со статистикой
    async getEventDetail(eventId) {
        try {
            const response = await api.get(`/events/${eventId}/detail`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Получить статистику по событию
    async getEventStatistics(eventId) {
        try {
            const response = await api.get(`/events/${eventId}/statistics`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Создать новое событие
    async createEvent(eventData) {
        try {
            const response = await api.post('/events', eventData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Обновить событие
    async updateEvent(eventId, eventData) {
        try {
            const response = await api.put(`/events/${eventId}`, eventData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Активировать событие
    async activateEvent(eventId) {
        try {
            const response = await api.post(`/events/${eventId}/activate`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Копировать этапы из другого события
    async copyStagesFromEvent(eventId, sourceEventId) {
        try {
            const response = await api.post(`/events/${eventId}/copy-stages`, null, {
                params: { source_event_id: sourceEventId }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Удалить событие
    async deleteEvent(eventId) {
        try {
            const response = await api.delete(`/events/${eventId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Получить результаты прошлых событий
    async getPastEventsResults() {
        try {
            const response = await api.get('/events/past-results');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Получить список жюри для события
    async getEventJudges(eventId) {
        try {
            const response = await api.get(`/events/${eventId}/judges`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Добавить жюри к событию
    async addJudgeToEvent(eventId, judgeId) {
        try {
            const response = await api.post(`/events/${eventId}/judges/${judgeId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Удалить жюри из события
    async removeJudgeFromEvent(eventId, judgeId) {
        try {
            const response = await api.delete(`/events/${eventId}/judges/${judgeId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};
