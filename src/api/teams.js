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

export const teamsApi = {
    async createTeam(teamData) {
        try {
            const data = {
                team_name: teamData.name,
                team_motto: teamData.motto
            };

            const response = await api.post('/teams/create', data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    async getAllTeams() {
        try {
            const response = await api.get('/teams');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};