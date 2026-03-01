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

export const stagesApi = {
  async getPublicStages() {
    try {
      const response = await api.get('/stages/public');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getCurrentStage() {
    try {
      const response = await api.get('/stages/current');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getAllStages() {
    try {
      const response = await api.get('/stages/all');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async setStage(stageId) {
    try {
      const response = await api.put(`/stages/${stageId}/activate`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getStageById(stageId) {
    try {
      const response = await api.get(`/stages/${stageId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getStagesHistory() {
    try {
      const response = await api.get('/stages/history');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async createStage(stageData) {
    try {
      const response = await api.post('/stages', stageData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async updateStage(stageId, stageData) {
    try {
      const response = await api.put(`/stages/${stageId}`, stageData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async deleteStage(stageId) {
    try {
      const response = await api.delete(`/stages/${stageId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};