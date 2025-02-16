<template>
  <div class="team-members">
    <h2>Участники команды</h2>
    <div class="members-list">
      <div v-if="loading" class="loading">Загрузка участников...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <template v-else>
        <div v-for="member in members" :key="member.id" class="member-card">
          <div class="member-info">
            <div class="member-name">{{ member.user?.name || 'Участник' }}</div>
            <div class="member-role">{{ formatRole(member.role) }}</div>
          </div>
          <div class="member-status" :class="member.status.toLowerCase()">
            {{ formatStatus(member.status) }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { teamsApi } from '@/api/teams';

const members = ref([]);
const loading = ref(false);
const error = ref(null);

const formatRole = (role) => {
  const roles = {
    'TEAMLEAD': 'Тимлид',
    'MEMBER': 'Участник'
  };
  return roles[role] || role;
};

const formatStatus = (status) => {
  const statuses = {
    'PENDING': 'Ожидает подтверждения',
    'ACCEPTED': 'Принят',
    'REJECTED': 'Отклонен'
  };
  return statuses[status] || status;
};

// TODO: Добавить метод загрузки участников после реализации API
</script>

<style scoped>
.team-members {
  padding: 1rem;
}

.members-list {
  margin-top: 1.5rem;
  display: grid;
  gap: 1rem;
}

.member-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--color-background-soft);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.member-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.member-name {
  font-weight: 600;
}

.member-role {
  font-size: 0.9rem;
  color: var(--color-text-light);
}

.member-status {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
}

.member-status.accepted {
  background: #e6f4ea;
  color: #1e7e34;
}

.member-status.pending {
  background: #fff3e0;
  color: #f57c00;
}

.member-status.rejected {
  background: #ffebee;
  color: #d32f2f;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-light);
}

.error {
  color: #d32f2f;
}
</style>