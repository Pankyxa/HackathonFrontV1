<template>
  <div class="team-mentor-section">
    <div class="section-header">
      <h2 class="section-title">Наставник команды</h2>
      <button
          v-if="isTeamLeader && !mentor && stageStore.isRegistration"
          class="add-mentor-btn"
          @click="$emit('add-mentor')"
      >
        Добавить наставника
      </button>
    </div>

    <div v-if="mentor" class="mentor-card">
      <div class="mentor-info">
        <div class="mentor-name">{{ mentor.user.full_name }}</div>
        <div class="mentor-details">
          <div class="mentor-role">Наставник команды</div>
          <div class="mentor-job">{{ mentor.user.mentor_info.job_title }} в {{ mentor.user.mentor_info.job }}</div>
          <div class="mentor-status" :class="getMentorStatusClass(mentor.user.current_status.name)">
            <span class="status-icon"></span>
            <span class="status-text">{{ getMentorStatusText(mentor.user.current_status.name) }}</span>
          </div>
        </div>
      </div>
      <div class="mentor-actions" v-if="isTeamLeader && stageStore.isRegistration">
        <button class="remove-btn" @click="$emit('remove-mentor', mentor)">
          Удалить
        </button>
      </div>
    </div>
    <div v-else class="no-mentor">
      <p class="no-mentor-text">Наставник не назначен</p>
      <p class="no-mentor-description" v-if="isTeamLeader">
        Для участия в мероприятии необходимо добавить наставника команды
      </p>
    </div>
  </div>
</template>

<script setup>
import {computed} from "vue";

import {useStageStore} from "@/stores/stage.js";

const stageStore = useStageStore();

const props = defineProps({
  members: {
    type: Array,
    required: true,
    default: () => []
  },
  isTeamLeader: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['add-mentor', 'remove-mentor'])

const mentor = computed(() => {
  if (!props.members) return null;
  return props.members.find(member => member.role === 'mentor')
})

const getMentorStatusText = (status) => {
  const statusMap = {
    'pending': 'В ожидании проверки документов',
    'need_update': 'Требуется обновить личные данные',
    'approved': 'Подтвержден'
  }
  return statusMap[status.toLowerCase()] || status
}

const getMentorStatusClass = (status) => {
  const statusLower = status.toLowerCase()
  return {
    'status-pending': statusLower === 'pending',
    'status-need-update': statusLower === 'need_update',
    'status-approved': statusLower === 'approved'
  }
}
</script>

<style scoped>
.team-mentor-section {
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

.add-mentor-btn {
  padding: 8px 20px;
  background: white;
  color: #5B51D8;
  border: 2px solid #5B51D8;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.add-mentor-btn:hover {
  background: rgba(91, 81, 216, 0.1);
}

.mentor-card {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem;
  background: white;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.mentor-card:hover {
  border-color: #5B51D8;
  box-shadow: 0 2px 8px rgba(91, 81, 216, 0.1);
}

.mentor-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mentor-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mentor-name {
  font-size: 1.1rem;
  color: #333;
  font-weight: 500;
}

.mentor-role {
  font-size: 0.9rem;
  color: #666;
}

.mentor-job {
  font-size: 0.9rem;
  color: #666;
}

.mentor-status {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  width: fit-content;
}

.mentor-status .status-icon {
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

.mentor-actions {
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

.no-mentor {
  padding: 2rem;
  text-align: center;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px dashed #dcdfe6;
}

.no-mentor-text {
  color: #606266;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.no-mentor-description {
  color: #909399;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .mentor-details {
    gap: 0.25rem;
  }

  .mentor-card {
    flex-direction: column;
    gap: 1rem;
  }

  .mentor-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>