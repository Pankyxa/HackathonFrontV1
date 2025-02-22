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

export const usersApi = {
    async searchUsers(query, role = 'member') {
        try {
            const endpoint = role === 'mentor'
                ? '/users/search/mentors'
                : '/users/search';

            const response = await api.get(endpoint+`?query=${query}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};