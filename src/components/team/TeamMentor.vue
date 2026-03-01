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
      <div class="mentor-avatar">
        <el-avatar
            :size="48"
            :src="getMentorAvatarUrl(mentor.user)"
        >
          <el-icon><User /></el-icon>
        </el-avatar>
        <!-- Status Dot for all statuses -->
        <span
            v-if="mentor.user.current_status?.name"
            class="status-dot"
            :class="getStatusDotClass(mentor.user.current_status.name)"
        ></span>
      </div>
      <div class="mentor-info">
        <div class="mentor-name">{{ mentor.user.full_name }}</div>
        <div class="mentor-role">Наставник команды</div>
        <div class="mentor-job" v-if="mentor.user.mentor_info?.job_title || mentor.user.mentor_info?.job">
          {{ mentor.user.mentor_info?.job_title }}<span v-if="mentor.user.mentor_info?.job_title && mentor.user.mentor_info?.job"> в </span>{{ mentor.user.mentor_info?.job }}
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
import {User} from '@element-plus/icons-vue';

import {useStageStore} from "@/stores/stage.js";

const stageStore = useStageStore();

const getMentorAvatarUrl = (user) => {
  if (!user?.id) return null;
  return `${import.meta.env.VITE_API_URL}/users/${user.id}/avatar`;
};

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

const getStatusDotClass = (status) => {
  const statusLower = status.toLowerCase()
  if (statusLower === 'approved') {
    return 'status-confirmed'
  }
  if (statusLower === 'pending') {
    return 'status-pending'
  }
  if (statusLower === 'need_update') {
    return 'status-need-update'
  }
  return 'status-confirmed' // По умолчанию зеленый
}
</script>

<style scoped>
.team-mentor-section {
  margin-top: 0;
  padding-top: 0;
  border-top: none;
  width: 100%;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 1.25rem; /* text-xl */
  font-weight: 600;
  color: #1e293b; /* text-slate-800 */
  margin: 0;
}

.add-mentor-btn {
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

.add-mentor-btn:hover {
  background: #eff6ff; /* bg-blue-50 */
}

/* Mentor Card */
.mentor-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: white; /* bg-white */
  border: 1px solid #e2e8f0; /* border-slate-200 - обычная граница */
  border-radius: 8px; /* rounded-lg */
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1); /* shadow-sm */
  transition: all 0.2s ease;
}

.mentor-card:hover {
  border-color: #93c5fd; /* hover:border-blue-300 */
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
}

.mentor-avatar {
  position: relative;
  flex-shrink: 0;
}

/* Status Dot for all statuses */
.status-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
}

.status-confirmed {
  background: #10b981; /* bg-green-500 */
}

.status-pending {
  background: #2196F3; /* blue */
}

.status-need-update {
  background: #F44336; /* red */
}

.mentor-info {
  flex: 1;
  min-width: 0; /* Для правильного обрезания текста */
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mentor-name {
  font-size: 1rem; /* text-base */
  font-weight: 600;
  color: #1e293b; /* text-slate-800 */
  line-height: 1.4;
  margin-bottom: 4px;
}

.mentor-role {
  font-size: 0.875rem; /* text-sm */
  color: #64748b; /* text-slate-500 */
  line-height: 1.4;
}

.mentor-job {
  font-size: 0.875rem; /* text-sm */
  color: #64748b; /* text-slate-500 */
  line-height: 1.4;
  font-style: italic;
}

.mentor-actions {
  flex-shrink: 0;
  margin-left: auto;
}

.remove-btn {
  padding: 6px 12px;
  background: white;
  color: #ef4444; /* text-red-500 */
  border: 1px solid #ef4444; /* border-red-500 */
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem; /* text-sm */
  font-weight: 500;
}

.remove-btn:hover {
  background: #fef2f2; /* bg-red-50 */
}

.no-mentor {
  padding: 24px;
  text-align: center;
  background: #f8fafc; /* bg-slate-50 */
  border-radius: 8px;
  border: 1px dashed #cbd5e1; /* border-slate-300 */
}

.no-mentor-text {
  color: #64748b; /* text-slate-500 */
  font-size: 1rem;
  margin-bottom: 8px;
  font-weight: 500;
}

.no-mentor-description {
  color: #94a3b8; /* text-slate-400 */
  font-size: 0.875rem; /* text-sm */
}

@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  .mentor-card {
    flex-wrap: wrap;
    padding: 12px;
  }
  
  .mentor-actions {
    width: 100%;
    justify-content: flex-end;
    margin-top: 8px;
    margin-left: 0;
  }
  
  .mentor-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .mentor-name {
    font-size: 0.875rem; /* text-sm */
  }
  
  .mentor-role,
  .mentor-job {
    font-size: 0.75rem; /* text-xs */
  }
}
</style>