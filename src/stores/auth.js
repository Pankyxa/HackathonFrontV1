import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authApi } from '@/api/auth'
import { teamsApi } from '@/api/teams'
import { useLoadingStore } from './loading'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const isHaveTeam = ref(false)
  const user = ref(null)
  const loadingStore = useLoadingStore()

  const setUser = (userData) => {
    user.value = userData
  }

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const userData = await authApi.getCurrentUser()
        user.value = userData
        isAuthenticated.value = true
      } else {
        isAuthenticated.value = false
        user.value = null
      }
    } catch (error) {
      isAuthenticated.value = false
      user.value = null
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
      user.value = null
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

  const updateUserInfo = async () => {
    try {
      const userData = await authApi.getCurrentUser()
      user.value = userData
      return userData
    } catch (error) {
      console.error('Error updating user info:', error)
      throw error
    }
  }

  const logout = () => {
    authApi.logout()
    isAuthenticated.value = false
    isHaveTeam.value = false
    user.value = null
    localStorage.removeItem('token')
  }

  return {
    isAuthenticated,
    isHaveTeam,
    user,
    checkAuth,
    checkTeam,
    initializeAuth,
    logout,
    setUser,
    updateUserInfo
  }
})