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
            const formData = new FormData();

            formData.append('team_name', teamData.team_name);
            formData.append('team_motto', teamData.team_motto);
            formData.append('logo', teamData.logo);

            // Add any additional fields from teamData
            Object.keys(teamData).forEach(key => {
                if (!['team_name', 'team_motto', 'logo'].includes(key)) {
                    formData.append(key, teamData[key]);
                }
            });

            const response = await api.post('/teams/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
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