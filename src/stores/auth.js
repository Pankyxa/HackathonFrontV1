import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authApi } from '@/api/auth'
import { teamsApi } from '@/api/teams'
import { useLoadingStore } from './loading'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const isHaveTeam = ref(false)
  const loadingStore = useLoadingStore()

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        await authApi.getCurrentUser()
        isAuthenticated.value = true
      } else {
        isAuthenticated.value = false
      }
    } catch (error) {
      isAuthenticated.value = false
      localStorage.removeItem('token')
    }
  }

  const checkTeam = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const teams = await teamsApi.getAllTeams()
        isHaveTeam.value = teams.length > 0
      }
    } catch (error) {
      isAuthenticated.value = false
      localStorage.removeItem('token')
    }
  }

  const initializeAuth = async () => {
    loadingStore.startLoading()
    try {
      await checkAuth()
      if (isAuthenticated.value) {
        await checkTeam()
      }
    } catch (error) {
      console.error('Error during auth initialization:', error)
    } finally {
      loadingStore.stopLoading()
    }
  }

  const logout = () => {
    authApi.logout()
    isAuthenticated.value = false
    isHaveTeam.value = false
    localStorage.removeItem('token')
  }

  return {
    isAuthenticated,
    isHaveTeam,
    checkAuth,
    checkTeam,
    initializeAuth,
    logout
  }
})