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

            const response = await api.get(endpoint + `?query=${query}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    async getPendingUsers({limit = 10, offset = 0, search = ''}) {
        try {
            const params = new URLSearchParams({
                limit: limit.toString(),
                offset: offset.toString(),
                ...(search && {search})
            });

            const response = await api.get(`/users/pending?${params}`);
            return {
                users: response.data.users,
                total: response.data.total
            };
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    async getAllUsers({limit = 10, offset = 0, search = '', roles = [], statuses = []}) {
        try {
            const params = new URLSearchParams();

            params.append('limit', limit);
            params.append('offset', offset);

            if (search) {
                params.append('search', search);
            }

            if (roles.length > 0) {
                roles.forEach(role => params.append('roles', role));
            }

            if (statuses.length > 0) {
                statuses.forEach(status => params.append('statuses', status));
            }

            const response = await api.get('/users/all', {
                params: params,
                paramsSerializer: {
                    indexes: null
                }
            });

            return {
                users: response.data.users,
                total: response.data.total
            };
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    async getUserDocuments(userId) {
        try {
            const response = await api.get(`/users/${userId}/documents`);
            const fileResponses = await Promise.all(
                response.data.map(async doc => {
                    const fileResponse = await api.get(`/files/${doc.id}`, {
                        responseType: 'blob'
                    });
                    const blob = new Blob([fileResponse.data], {
                        type: fileResponse.headers['content-type']
                    });
                    return {
                        id: doc.id,
                        name: doc.filename,
                        description: doc.file_type.description,
                        url: URL.createObjectURL(blob)
                    };
                })
            );
            return fileResponses;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    async updateUserStatus(userId, status, comment = '') {
        try {
            const response = await api.put(`/users/${userId}/status`, {
                status,
                comment
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    updateUserRoles: async (userId, roles) => {
        const response = await api.put(`/users/${userId}/roles`, {roles})
        return response.data
    },

    async updateCurrentUser(userData) {
        const response = await api.put(`/users/me`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(userData)
        })

        if (!response.ok) {
            throw new Error('Failed to update user data')
        }

        return await response.json()
    },

    async updateUserDocuments(file, documentType) {
        try {
            const formData = new FormData();
            formData.append('file', file);
            if (documentType) {
                formData.append('document_type', documentType);
            } else if (documentType.includes('certificate')) {
                formData.append('document_type', 'certificate');
            }

            const response = await api.put('/users/me/documents', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};
