import { ref, watch, onMounted, onUnmounted } from 'vue'
import { teamsApi } from '@/api/teams'
import { useAuthStore } from '@/stores/auth'
import { useStageStore } from '@/stores/stage'

export function useTeamInvites() {
  const hasInvites = ref(false)
  const invitesCount = ref(0)
  const loading = ref(false)
  const authStore = useAuthStore()
  const stageStore = useStageStore()
  let checkInterval = null

  const checkInvites = async () => {
    // Проверяем только если пользователь авторизован и на этапе регистрации
    if (!authStore.isAuthenticated || !stageStore.isRegistration) {
      hasInvites.value = false
      invitesCount.value = 0
      return
    }

    // Проверяем, может ли пользователь получать приглашения
    const userCanReceiveInvites = authStore.isMentor || (authStore.isMember && !authStore.isHaveTeam)
    if (!userCanReceiveInvites) {
      hasInvites.value = false
      invitesCount.value = 0
      return
    }

    try {
      loading.value = true
      const invites = await teamsApi.getInvites()
      invitesCount.value = invites?.length || 0
      hasInvites.value = invitesCount.value > 0
    } catch (error) {
      // Если ошибка (например, 404 или нет доступа), считаем что приглашений нет
      hasInvites.value = false
      invitesCount.value = 0
    } finally {
      loading.value = false
    }
  }

  const startPolling = (interval = 30000) => {
    // Проверяем сразу
    checkInvites()
    
    // Затем проверяем каждые 30 секунд
    if (checkInterval) {
      clearInterval(checkInterval)
    }
    checkInterval = setInterval(checkInvites, interval)
  }

  const stopPolling = () => {
    if (checkInterval) {
      clearInterval(checkInterval)
      checkInterval = null
    }
  }

  // Отслеживаем изменения авторизации и этапа
  watch(
    [() => authStore.isAuthenticated, () => stageStore.isRegistration, () => authStore.isMentor, () => authStore.isMember, () => authStore.isHaveTeam],
    () => {
      checkInvites()
    },
    { immediate: true }
  )

  // Автоматически запускаем и останавливаем polling при монтировании/размонтировании
  // Это будет работать только если composable используется в setup компонента
  onMounted(() => {
    startPolling()
  })

  onUnmounted(() => {
    stopPolling()
  })

  return {
    hasInvites,
    invitesCount,
    loading,
    checkInvites,
    startPolling,
    stopPolling
  }
}
