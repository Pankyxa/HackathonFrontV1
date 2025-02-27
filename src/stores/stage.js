import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { stagesApi } from '@/api/stages'
import { useLoadingStore } from './loading'

export const useStageStore = defineStore('stage', () => {
  const currentStage = ref(null)
  const error = ref(null)
  const loadingStore = useLoadingStore()

  // Вычисляемые свойства для проверки текущего этапа
  const isRegistration = computed(() => currentStage.value?.type === 'registration')
  const isRegistrationClosed = computed(() => currentStage.value?.type === 'registration_closed')
  const isTaskDistribution = computed(() => currentStage.value?.type === 'task_distribution')
  const isSolutionSubmission = computed(() => currentStage.value?.type === 'solution_submission')
  const isSolutionReview = computed(() => currentStage.value?.type === 'solution_review')
  const isOnlineDefense = computed(() => currentStage.value?.type === 'online_defense')
  const isResultsPublication = computed(() => currentStage.value?.type === 'results_publication')
  const isAwardCeremony = computed(() => currentStage.value?.type === 'award_ceremony')

  // Дополнительные полезные вычисляемые свойства
  const stageName = computed(() => currentStage.value?.name || 'Этап не определен')
  const stageOrder = computed(() => currentStage.value?.order || 0)
  const isActive = computed(() => currentStage.value?.is_active || false)

  const fetchCurrentStage = async () => {
    loadingStore.startLoading()
    try {
      error.value = null
      const data = await stagesApi.getCurrentStage()
      currentStage.value = data
      return data
    } catch (err) {
      error.value = err.response?.data?.detail || 'Ошибка при получении текущего этапа'
      console.error('Error fetching current stage:', err)
      throw err
    } finally {
      loadingStore.stopLoading()
    }
  }

  const initializeStage = async () => {
    loadingStore.startLoading()
    try {
      await fetchCurrentStage()
    } catch (error) {
      console.error('Error during stage initialization:', error)
    } finally {
      loadingStore.stopLoading()
    }
  }

  const updateStageInfo = async () => {
    try {
      const stageData = await stagesApi.getCurrentStage()
      currentStage.value = stageData
      return stageData
    } catch (error) {
      console.error('Error updating stage info:', error)
      throw error
    }
  }

  const resetStage = () => {
    currentStage.value = null
    error.value = null
  }

  return {
    currentStage,
    error,
    // Этапы
    isRegistration,
    isRegistrationClosed,
    isTaskDistribution,
    isSolutionSubmission,
    isSolutionReview,
    isOnlineDefense,
    isResultsPublication,
    isAwardCeremony,
    // Дополнительные свойства
    stageName,
    stageOrder,
    isActive,
    // Методы
    fetchCurrentStage,
    initializeStage,
    updateStageInfo,
    resetStage
  }
})