<template>
  <div class="team-header-card">
    <!-- Status Badge - Top Right -->
    <div :class="['team-status-badge', statusClass]">
      <span class="status-icon"></span>
      <span class="status-text">{{ statusText }}</span>
    </div>
    
    <!-- Main Content: Logo, Name, Motto -->
    <div class="team-header-content">
      <!-- Logo (Left) -->
      <div class="team-logo-section">
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
        <input
            type="file"
            ref="fileInput"
            @change="handleFileSelect"
            accept="image/*"
            style="display: none"
        >
        <button
            v-if="isTeamLeader && stageStore.isRegistration"
            class="change-logo-btn"
            @click="triggerFileInput"
        >
          Изменить логотип
        </button>
      </div>
      
      <!-- Name and Motto (Center) -->
      <div class="team-info-section">
        <h2 class="team-name">{{ teamData.team_name }}</h2>
        <p class="team-motto">{{ teamData.team_motto }}</p>
      </div>
    </div>
    
    <!-- Edit Button -->
    <div class="team-actions" v-if="isTeamLeader && stageStore.isRegistration">
      <button class="edit-btn" @click="$emit('edit')">
        Редактировать информацию
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import {useStageStore} from "@/stores/stage.js";

const stageStore = useStageStore();

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
.team-header-card {
  position: relative;
  width: 100%;
}

/* Status Badge - Top Right */
.team-status-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.875rem; /* text-sm */
  font-weight: 500;
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

/* Main Content: Logo, Name, Motto */
.team-header-content {
  display: flex;
  align-items: center;
  gap: 24px;
  padding-right: 120px; /* Отступ для статуса справа */
}

.team-logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.logo-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
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
  background: #f1f5f9; /* bg-slate-100 */
  color: #64748b; /* text-slate-500 */
  border: 2px dashed #cbd5e1; /* border-slate-300 */
  font-size: 0.75rem; /* text-xs */
  text-align: center;
  padding: 8px;
}

.change-logo-btn {
  padding: 6px 12px;
  background: white;
  color: #2563eb; /* text-blue-600 */
  border: 1px solid #2563eb; /* border-blue-600 */
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem; /* text-sm */
  font-weight: 500;
  white-space: nowrap;
}

.change-logo-btn:hover {
  background: #eff6ff; /* bg-blue-50 */
}

.team-info-section {
  flex: 1;
  min-width: 0; /* Для правильного обрезания текста */
}

.team-name {
  font-size: 1.5rem; /* text-2xl */
  font-weight: 600;
  color: #1e293b; /* text-slate-800 */
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.team-motto {
  font-size: 1rem; /* text-base */
  color: #64748b; /* text-slate-500 */
  margin: 0;
  line-height: 1.5;
  font-style: italic;
}

.team-actions {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0; /* border-slate-200 */
}

.edit-btn {
  padding: 8px 16px;
  background: white;
  color: #2563eb; /* text-blue-600 */
  border: 1px solid #2563eb; /* border-blue-600 */
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 0.875rem; /* text-sm */
}

.edit-btn:hover {
  background: #eff6ff; /* bg-blue-50 */
}

@media (max-width: 768px) {
  .team-header-card {
    padding: 16px;
  }
  
  .team-status-badge {
    position: static;
    margin-bottom: 12px;
    align-self: flex-start;
  }
  
  .team-header-content {
    flex-direction: column;
    align-items: flex-start;
    padding-right: 0;
    gap: 16px;
  }
  
  .team-logo-section {
    align-items: flex-start;
  }
  
  .team-info-section {
    width: 100%;
  }
  
  .team-name {
    font-size: 1.25rem; /* text-xl */
  }
  
  .team-motto {
    font-size: 0.875rem; /* text-sm */
  }
}
</style>