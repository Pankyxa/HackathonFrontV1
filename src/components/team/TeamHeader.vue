<template>
  <div class="team-header">
    <div class="logo-container">
      <div class="logo-wrapper">
        <img
            v-if="teamLogo"
            :src="teamLogo"
            alt="Team Logo"
            class="team-logo"
        />
        <div v-else class="logo-placeholder">
          <span>Нет логотипа</span>
        </div>
      </div>
      <div class="logo-actions">
        <input
            type="file"
            ref="fileInput"
            @change="handleFileSelect"
            accept="image/*"
            style="display: none"
        >
        <button
            v-if="isTeamLeader"
            class="change-logo-btn"
            @click="triggerFileInput"
        >
          Изменить логотип
        </button>
      </div>
    </div>
    <div class="team-details">
      <div class="team-header-info">
        <div class="info-group">
          <label>Название команды</label>
          <div class="info-value">{{ teamData.team_name }}</div>
        </div>
        <div :class="['team-status', statusClass]">
          <span class="status-icon"></span>
          <span class="status-text">{{ statusText }}</span>
        </div>
      </div>
      <div class="info-group">
        <label>Девиз команды</label>
        <div class="info-value">{{ teamData.team_motto }}</div>
      </div>
      <button class="edit-btn" v-if="isTeamLeader" @click="$emit('edit')">
        Редактировать информацию
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  teamData: {
    type: Object,
    required: true
  },
  teamLogo: {
    type: String,
    default: null
  },
  isTeamLeader: {
    type: Boolean,
    default: false
  },
  teamMembers: {
    type: Array,
    default: () => []
  },
  statusText: {
    type: String,
    default: null,
  },
  statusClass: {
    type: String,
    default: '',
  }
})

const emit = defineEmits(['edit', 'edit-logo'])
const fileInput = ref(null)

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    emit('edit-logo', file)
  }
  event.target.value = ''
}
</script>

<style scoped>
.team-info {
  max-width: 800px;
}

.team-header {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.logo-container {
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-wrapper {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
}

.team-logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.logo-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-background-soft);
  color: var(--color-text-light);
  border: 2px dashed var(--color-border);
}

.logo-actions {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  width: 100%;
}

.change-logo-btn {
  padding: 8px 16px;
  background: #FFFFFF;
  color: #5B51D8;
  border: 2px solid #5B51D8;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 15px;
  font-weight: 500;
  min-width: 120px;
  text-align: center;
}

.change-logo-btn:hover {
  background: rgba(91, 81, 216, 0.1);
}

.change-logo-btn:active {
  transform: translateY(1px);
}

.team-info-section,
.team-details {
  flex: 1;
}

.info-group {
  margin-bottom: 1.5rem;
}

.info-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
  font-size: 0.9rem;
}

.info-value {
  font-size: 1.1rem;
  color: #333;
  padding: 0.5rem 0;
}

.edit-btn {
  margin-top: 1rem;
  padding: 8px 20px;
  background: white;
  color: #5B51D8;
  border: 2px solid #5B51D8;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.edit-btn:hover {
  background: rgba(91, 81, 216, 0.1);
}

.edit-btn:active {
  transform: translateY(1px);
}

.team-header-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.team-header-info .info-group {
  margin-bottom: 0;
}

.team-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.9rem;
  height: fit-content;
  margin-top: 24px;
}

.status-icon {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.status-incomplete {
  background: rgba(255, 152, 0, 0.1);
  color: #FF9800;
}

.status-incomplete .status-icon {
  background: #FF9800;
}

.status-pending {
  background: rgba(33, 150, 243, 0.1);
  color: #2196F3;
}

.status-pending .status-icon {
  background: #2196F3;
}

.status-needs-update {
  background: rgba(244, 67, 54, 0.1);
  color: #F44336;
}

.status-needs-update .status-icon {
  background: #F44336;
}

.status-active {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

.status-active .status-icon {
  background: #4CAF50;
}

@media (max-width: 768px) {
  .team-header {
    flex-direction: column;
    align-items: center;
  }

  .team-details {
    width: 100%;
    text-align: center;
  }

  .info-group {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .info-value {
    text-align: center;
  }

  .team-header-info {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .team-status {
    margin-top: 0;
  }
}
</style>