<template>
  <div class="team-invites">
    <h2>Приглашения в команду</h2>
    <div v-loading="loading" class="invites-container">
      <div v-if="invites.length > 0" class="invites-list">
        <div v-for="invite in invites" :key="invite.member.id" class="invite-card">
          <div class="invite-info">
            <div class="team-logo" v-if="invite.team.logo_file_id">
              <img :src="getTeamLogoUrl(invite.team.id)" alt="Team logo" />
            </div>
            <div class="invite-info-content">
              <h3>{{ invite.team.team_name }}</h3>
              <p class="team-motto">{{ invite.team.team_motto }}</p>
            </div>
          </div>
          <div class="invite-actions">
            <button
                class="btn-accept"
                @click="acceptInvite(invite.member.id)"
                :disabled="isProcessing"
            >
              Принять
            </button>
            <button
                class="btn-decline"
                @click="declineInvite(invite.member.id)"
                :disabled="isProcessing"
            >
              Отклонить
            </button>
          </div>
        </div>
      </div>
      <div v-else-if="!loading" class="no-invites">
        <p>У вас пока нет приглашений в команды</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { teamsApi } from '@/api/teams'
import { useAuthStore } from '@/stores/auth'

const emit = defineEmits(['changeTab'])
const authStore = useAuthStore()
const invites = ref([])
const loading = ref(false)
const isProcessing = ref(false)

const getTeamLogoUrl = (teamId) => {
  return `${import.meta.env.VITE_API_URL}/teams/${teamId}/logo`
}

const loadInvites = async () => {
  try {
    loading.value = true
    const response = await teamsApi.getInvites()
    invites.value = response || []
  } catch (error) {
    console.error('Error loading invites:', error)
    ElMessage.error('Ошибка при загрузке приглашений')
  } finally {
    loading.value = false
  }
}

const acceptInvite = async (inviteId) => {
  try {
    isProcessing.value = true
    await teamsApi.acceptInvite(inviteId)

    await authStore.initializeAuth()

    await loadInvites()

    ElMessage.success('Приглашение принято')

    if (authStore.isMember && !authStore.isMentor) {
      emit('changeTab', 'profile')
    }
  } catch (error) {
    console.error('Error accepting invite:', error)
    ElMessage.error('Ошибка при принятии приглашения')
  } finally {
    isProcessing.value = false
  }
}

const declineInvite = async (inviteId) => {
  try {
    isProcessing.value = true
    await teamsApi.declineInvite(inviteId)
    await loadInvites()
    ElMessage.success('Приглашение отклонено')
  } catch (error) {
    console.error('Error declining invite:', error)
    ElMessage.error('Ошибка при отклонении приглашения')
  } finally {
    isProcessing.value = false
  }
}

onMounted(() => {
  loadInvites()
})
</script>

<style scoped>
.team-invites {
  max-width: 800px;
  margin: 0 auto;
}

h2 {
  margin-bottom: 2rem;
  color: #333333;
}

.invites-container {
  min-height: 200px;
}

.invites-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.invite-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.invite-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.invite-info-content {
  flex: 1;
}

.invite-info h3 {
  margin: 0 0 0.5rem 0;
  color: #333333;
}

.invite-info p {
  margin: 0;
  color: #333333;
}

.team-logo {
  margin-top: 1rem;
  width: 64px;
  height: 64px;
  overflow: hidden;
  border-radius: 8px;
}

.team-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.invite-actions {
  display: flex;
  gap: 1rem;
}

.btn-accept,
.btn-decline {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-accept:disabled,
.btn-decline:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-accept {
  background: rgba(76, 175, 80);
  color: white;
}

.btn-accept:hover:not(:disabled) {
  background: rgb(59, 138, 59);
}

.btn-decline {
  background: #dc3545;
  color: white;
}

.btn-decline:hover:not(:disabled) {
  background: #c82333;
}

.no-invites {
  text-align: center;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
  color: #333333;
}

@media (max-width: 768px) {
  .invite-card {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .team-logo {
    margin: 1rem auto;
  }

  .invite-actions {
    width: 100%;
    justify-content: center;
  }
}
</style>