<template>
  <div class="team-invites">
    <h2>Приглашения в команду</h2>
    <div v-if="invites.length > 0" class="invites-list">
      <div v-for="invite in invites" :key="invite.id" class="invite-card">
        <div class="invite-info">
          <h3>{{ invite.teamName }}</h3>
          <p>Приглашение от: {{ invite.inviterName }}</p>
        </div>
        <div class="invite-actions">
          <button class="btn-accept" @click="acceptInvite(invite.id)">Принять</button>
          <button class="btn-decline" @click="declineInvite(invite.id)">Отклонить</button>
        </div>
      </div>
    </div>
    <div v-else class="no-invites">
      <p>У вас пока нет приглашений в команды</p>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {teamsApi} from '@/api/teams'

const invites = ref([])

const loadInvites = async () => {
  try {
    const response = await teamsApi.getInvites()
    invites.value = response || []
  } catch (error) {
    console.error('Error loading invites:', error)
  }
}

const acceptInvite = async (inviteId) => {
  try {
    await teamsApi.acceptInvite(inviteId)
    await loadInvites()
  } catch (error) {
    console.error('Error accepting invite:', error)
  }
}

const declineInvite = async (inviteId) => {
  try {
    await teamsApi.declineInvite(inviteId)
    await loadInvites()
  } catch (error) {
    console.error('Error declining invite:', error)
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
  color: var(--color-heading);
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

.invite-info h3 {
  margin: 0 0 0.5rem 0;
  color: var(--color-heading);
}

.invite-info p {
  margin: 0;
  color: var(--color-text);
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

.btn-accept {
  background: var(--color-primary);
  color: white;
}

.btn-accept:hover {
  background: var(--color-primary-dark);
}

.btn-decline {
  background: #dc3545;
  color: white;
}

.btn-decline:hover {
  background: #c82333;
}

.no-invites {
  text-align: center;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
  color: var(--color-text);
}

@media (max-width: 768px) {
  .invite-card {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .invite-actions {
    width: 100%;
    justify-content: center;
  }
}
</style>