import axios from 'axios';

// Создаем инстанс axios с базовым URL из переменных окружения
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Перехватчик для добавления токена к запросам
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authApi = {
    async register(data) {
        try {
            const formData = new FormData();
            const { role, ...dataWithoutRole } = data;

            Object.keys(dataWithoutRole).forEach(key => {
                formData.append(key, dataWithoutRole[key]);
            });

            const endpoint = role === 'participant'
                ? '/auth/register'
                : 'auth/register/mentor'

            const response = await api.post(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    async registerSpecial(data) {
        try {
            const formData = new FormData();
            Object.keys(data).forEach(key => {
                formData.append(key, data[key]);
            });

            const response = await api.post('/auth/register/special', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    async login(email, password) {
        try {
            const response = await api.post('/auth/login', {
                email,
                password
            });
            const {access_token} = response.data;
            localStorage.setItem('token', access_token);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    async getCurrentUser() {
        try {
            const response = await api.get('/auth/me');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    async resendVerificationEmail(email) {
        try {
            const formData = new FormData();
            formData.append('email', email);
            const response = await api.post('/auth/resend-verification-email', formData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    async verifyEmail(token) {
        try {
            const response = await api.get(`/auth/verify-email/${token}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },


    // Функция выхода
    logout() {
        localStorage.removeItem('token');
    }
};