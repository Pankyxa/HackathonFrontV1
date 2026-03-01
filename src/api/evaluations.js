import axios from 'axios';
import { cache, getEvaluationCacheKey, invalidateEvaluationCache } from '@/utils/cache';

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

export const evaluationsApi = {
  async getUnevaluatedTeams(stageGroup = null) {
    try {
      const params = stageGroup ? { stage_group: stageGroup } : {};
      const response = await api.get('/evaluations/unevaluated-teams', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getMyEvaluations(stageGroup = null) {
    try {
      const cacheKey = getEvaluationCacheKey('my-evaluations', { stageGroup });
      const cached = cache.get(cacheKey);
      if (cached !== null) {
        return cached;
      }

      const params = stageGroup ? { stage_group: stageGroup } : {};
      const response = await api.get('/evaluations/my-evaluations', { params });
      cache.set(cacheKey, response.data, 300); // Кэш на 5 минут
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async createEvaluation(evaluationData) {
    try {
      const response = await api.post('/evaluations/evaluate-team', evaluationData);
      // Инвалидируем все кэши оценок после создания/обновления оценки
      invalidateEvaluationCache();
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getTeamEvaluations(teamId, stageGroup = null) {
    try {
      const cacheKey = getEvaluationCacheKey('team', { teamId, stageGroup });
      const cached = cache.get(cacheKey);
      if (cached !== null) {
        return cached;
      }

      const params = stageGroup ? { stage_group: stageGroup } : {};
      const response = await api.get(`/evaluations/team/${teamId}`, { params });
      cache.set(cacheKey, response.data, 300); // Кэш на 5 минут
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getDetailedEvaluations(params = {}) {
    try {
      const response = await api.get('/evaluations/detailed', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getResults(stageGroup = null) {
    try {
      const cacheKey = getEvaluationCacheKey('results', { stageGroup });
      const cached = cache.get(cacheKey);
      if (cached !== null) {
        return cached;
      }

      const params = stageGroup ? { stage_group: stageGroup } : {};
      const response = await api.get('/evaluations/results', { params });
      cache.set(cacheKey, response.data, 300); // Кэш на 5 минут
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  async getPublicResults(stageGroup = null) {
    try {
      const cacheKey = getEvaluationCacheKey('public-results', { stageGroup });
      const cached = cache.get(cacheKey);
      if (cached !== null) {
        return cached;
      }

      const params = stageGroup ? { stage_group: stageGroup } : {};
      const response = await api.get('/evaluations/public-results', { params });
      cache.set(cacheKey, response.data, 300); // Кэш на 5 минут
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};