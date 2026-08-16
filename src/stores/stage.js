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
  const isOnSiteDefense = computed(() => currentStage.value?.type === 'on_site_defense')
  const isResultsPublication = computed(() => currentStage.value?.type === 'results_publication')
  const isAwardCeremony = computed(() => currentStage.value?.type === 'award_ceremony')
  
  // Проверка этапов для финалистов
  const isFinalistsSelection = computed(() => currentStage.value?.type === 'finalists_selection')
  const isRemoteOnSitePreparation = computed(() => currentStage.value?.type === 'remote_on_site_preparation')
  const isOnSiteStage = computed(() => {
    const stage = currentStage.value
    if (!stage) return false
    if (stage.group === 'on_site') return true
    const stageType = stage.type
    return stageType === 'on_site_task_distribution' ||
           stageType === 'on_site_solution_submission' ||
           stageType === 'on_site_defense'
  })

  // Подготовка к очному и все очные этапы (включая публикацию результатов)
  const isOnSiteContentPhase = computed(() => {
    return isRemoteOnSitePreparation.value ||
           isOnSiteStage.value ||
           isResultsPublication.value ||
           isAwardCeremony.value
  })

  const shouldShowRemoteExtraTabs = computed(() => {
    const stageType = currentStage.value?.type
    return [
      'task_distribution',
      'solution_submission',
      'solution_review',
      'remote_task_distribution',
      'remote_solution_submission',
      'online_defense',
      'finalists_selection',
    ].includes(stageType)
  })

  const shouldShowOnSiteExtraTabs = computed(() => {
    const stageType = currentStage.value?.type
    return [
      'on_site_task_distribution',
      'on_site_solution_submission',
      'on_site_defense',
      'results_publication',
      'award_ceremony',
    ].includes(stageType)
  })
  
  // Показывать финалистов только на этапе определения финалистов
  const shouldShowFinalists = computed(() => {
    if (isResultsPublication.value || isAwardCeremony.value) return false
    return isFinalistsSelection.value
  })

  // Подготовка к очному, распределение заданий, прием решений, защита решений
  const shouldShowOnSiteParticipants = computed(() => {
    const stageType = currentStage.value?.type
    return stageType === 'remote_on_site_preparation' || isOnSiteStage.value
  })
  
  // Показывать победителей только на этапе публикации результатов и церемонии награждения
  const shouldShowWinners = computed(() => {
    return isResultsPublication.value || isAwardCeremony.value
  })

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
    isOnSiteDefense,
    isResultsPublication,
    isAwardCeremony,
    // Финалисты
    isFinalistsSelection,
    isRemoteOnSitePreparation,
    isOnSiteStage,
    isOnSiteContentPhase,
    shouldShowRemoteExtraTabs,
    shouldShowOnSiteExtraTabs,
    shouldShowFinalists,
    shouldShowOnSiteParticipants,
    shouldShowWinners,
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