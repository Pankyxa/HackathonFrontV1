<template>
  <div class="team-members-section">
    <div class="section-header">
      <h2 class="section-title">Участники команды</h2>
      <div class="header-right">
        <span class="member-count">{{ members.length }}/5 участников</span>
        <button
            v-if="isTeamLeader"
            class="add-member-btn"
            @click="showUserSearch"
            :disabled="members.length >= 5"
        >
          Добавить участника
        </button>
      </div>
    </div>
    <div class="members-list">
      <div v-for="member in members" :key="member.id" class="member-card">
        <div class="member-info">
          <div class="member-name">{{ member.user.full_name }}</div>
          <div class="member-details">
            <div class="member-role">{{ getRoleName(member.role) }}</div>
            <div class="member-status" :class="getMemberStatusClass(member.user.current_status.name)">
              <span class="status-icon"></span>
              <span class="status-text">{{ getMemberStatusText(member.user.current_status.name) }}</span>
            </div>
          </div>
        </div>
        <div class="member-actions" v-if="isTeamLeader && member.user.id !== currentUserId">
          <button class="remove-btn" @click="$emit('remove-member', member)">
            Удалить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  members: {
    type: Array,
    required: true
  },
  isTeamLeader: {
    type: Boolean,
    default: false
  },
  currentUserId: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['add-member', 'remove-member'])

const getRoleName = (role) => {
  const upperRole = role.toUpperCase()
  const roles = {
    'TEAMLEAD': 'Лидер команды',
    'MEMBER': 'Участник команды'
  }
  return roles[upperRole] || role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
}

const getMemberStatusText = (status) => {
  const statusMap = {
    'pending': 'В ожидании проверки документов',
    'need_update': 'Требуется обновить личные данные',
    'approved': 'Подтвержден'
  }
  return statusMap[status] || status
}

const getMemberStatusClass = (status) => {
  return {
    'status-pending': status === 'pending',
    'status-need-update': status === 'need_update',
    'status-approved': status === 'approved'
  }
}

const showUserSearch = () => {
  if (props.members.length >= 5) {
    return
  }
  emit('add-member')
}
</script>

<style scoped>
.team-members-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #dcdfe6;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.5rem;
  color: #333;
  font-weight: 500;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.member-count {
  color: #606266;
  font-size: 0.9rem;
}

.add-member-btn {
  padding: 8px 20px;
  background: white;
  color: #5B51D8;
  border: 2px solid #5B51D8;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.add-member-btn:hover {
  background: rgba(91, 81, 216, 0.1);
}

.add-member-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.members-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.member-card {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem;
  background: white;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.member-card:hover {
  border-color: #5B51D8;
  box-shadow: 0 2px 8px rgba(91, 81, 216, 0.1);
}

.member-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.member-details {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.25rem;
}

.member-name {
  font-size: 1.1rem;
  color: #333;
  font-weight: 500;
}

.member-role {
  font-size: 0.9rem;
  color: #666;
}

.member-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
}

.member-status .status-icon {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
}

.status-pending {
  background: rgba(33, 150, 243, 0.1);
  color: #2196F3;
}

.status-pending .status-icon {
  background: #2196F3;
}

.status-need-update {
  background: rgba(244, 67, 54, 0.1);
  color: #F44336;
}

.status-need-update .status-icon {
  background: #F44336;
}

.status-approved {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

.status-approved .status-icon {
  background: #4CAF50;
}

.member-actions {
  display: flex;
  gap: 0.5rem;
}

.remove-btn {
  padding: 6px 16px;
  background: white;
  color: #f56c6c;
  border: 1px solid #f56c6c;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.remove-btn:hover {
  background: #fef0f0;
}

@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .member-details {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .member-status {
    font-size: 0.75rem;
  }
}
</style>