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

            if (teamData.member_ids) {
                formData.append('member_ids', teamData.member_ids);
            } else {
                formData.append('member_ids', JSON.stringify([]));
            }

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
    },

    async updateTeamInfo(teamId, teamData) {
        try {
            const formData = new FormData();
            formData.append('team_name', teamData.team_name);
            formData.append('team_motto', teamData.team_motto);

            const response = await api.put(`/teams/${teamId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    async updateTeamLogo(teamId, file) {
        try {
            const formData = new FormData();
            formData.append('logo', file, file.name);

            const response = await api.put(`/teams/${teamId}/logo`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    async getTeamMembers(teamId) {
        try {
            const response = await api.get(`/teams/${teamId}/members`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    async getTeam(teamId = null) {
        try {
            let response;
            if (teamId) {
                response = await api.get(`/teams/mentor/teams/${teamId}`);
            } else {
                response = await api.get('/teams/my/team');
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    async getMentorTeams() {
        try {
            const response = await api.get('/teams/mentor/teams');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    async removeTeamMember(teamId, memberId) {
        try {
            const response = await api.delete(`/teams/${teamId}/members/${memberId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    async addTeamMember(teamId, userData) {
        try {
            const response = await api.post(`/teams/${teamId}/members`, userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    async addTeamMentor(teamId, mentorId) {
        try {
            const response = await api.post(`/teams/${teamId}/mentor?mentor_id=${mentorId}`, {}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            if (error.response?.data?.detail) {
                if (Array.isArray(error.response.data.detail)) {
                    const messages = error.response.data.detail
                        .map(err => err.msg)
                        .join(', ');
                    throw new Error(messages);
                } else {
                    throw new Error(error.response.data.detail);
                }
            }
            throw error;
        }
    },

    async removeTeamMentor(teamId, mentorMemberId) {
        try {
            const response = await api.delete(`/teams/${teamId}/members/${mentorMemberId}`);
            return response.data;
        } catch (error) {
            if (error.response?.data?.detail) {
                throw new Error(error.response.data.detail);
            }
            throw error;
        }
    },

    async deleteTeam(teamId) {
        try {
            const response = await api.delete(`/teams/${teamId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    async leaveTeam() {
        try {
            const response = await api.post(`/teams/leave`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    async getAdminTeams({ limit = 10, offset = 0, search = '', status = '' } = {}) {
        try {
            const params = {
                limit,
                offset
            }

            if (search && search.trim()) {
                params.search = search
            }

            if (status) {
                params.status = status
            }

            const response = await api.get('/teams/admin/teams', { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    async getInvites() {
        try {
            const response = await api.get('/teams/invitations');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    async acceptInvite(inviteId) {
        try {
            const response = await api.post(`/teams/invitations/${inviteId}/accept`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    async declineInvite(inviteId) {
        try {
            const response = await api.post(`/teams/invitations/${inviteId}/reject`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};