<template>
  <div class="team-members-section">
    <div class="section-header">
      <div class="header-right">
        <span class="member-count">{{ filteredMembers.length }}/5 участников</span>
        <button
            v-if="canManageMembers"
            class="add-member-btn"
            @click="showUserSearch"
            :disabled="filteredMembers.length >= 5"
        >
          Добавить участника
        </button>
      </div>
    </div>
    <div class="members-grid">
      <div v-for="member in filteredMembers" :key="member.id" class="member-card">
        <div class="member-avatar">
          <el-avatar
              :size="48"
              :src="getUserAvatarUrl(member.user)"
          >
            <el-icon><User /></el-icon>
          </el-avatar>
          <!-- Status Dot for all statuses -->
          <span
              v-if="member.user.current_status?.name"
              class="status-dot"
              :class="getStatusDotClass(member.user.current_status.name)"
          ></span>
        </div>
        <div class="member-info">
          <div class="member-name">{{ member.user.full_name }}</div>
          <div class="member-role">{{ getRoleName(member.role) }}</div>
        </div>
        <div
            class="member-actions"
            v-if="canManageMembers"
        >
          <button
              v-if="member.role.toUpperCase() === 'TEAMLEAD'"
              class="change-btn"
              @click="$emit('change-leader')"
          >
            Изменить
          </button>
          <button
              v-else
              class="remove-btn"
              @click="$emit('remove-member', member)"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed} from "vue";
import {User} from '@element-plus/icons-vue';

import {useStageStore} from "@/stores/stage.js";

const stageStore = useStageStore();

const getUserAvatarUrl = (user) => {
  if (!user?.id) return null;
  return `${import.meta.env.VITE_API_URL}/users/${user.id}/avatar`;
};

const props = defineProps({
  members: {
    type: Array,
    required: true
  },
  isTeamLeader: {
    type: Boolean,
    default: false
  },
  canManageMembers: {
    type: Boolean,
    default: false
  },
  currentUserId: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['add-member', 'remove-member', 'change-leader'])

const filteredMembers = computed(() => {
  const members = props.members.filter(member =>
      member.role.toUpperCase() === 'MEMBER' ||
      member.role.toUpperCase() === 'TEAMLEAD'
  );

  return members.sort((a, b) => {
    if (a.role.toUpperCase() === 'TEAMLEAD') return -1;
    if (b.role.toUpperCase() === 'TEAMLEAD') return 1;
    return 0;
  });
})

const getRoleName = (role) => {
  const upperRole = role.toUpperCase()
  const roles = {
    'TEAMLEAD': 'Лидер команды',
    'MEMBER': 'Участник команды'
  }
  return roles[upperRole] || role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
}

const getStatusDotClass = (status) => {
  if (!stageStore.isRegistration && status !== "approved") {
    return 'status-need-update'
  }
  if (status === 'approved') {
    return 'status-confirmed'
  }
  if (status === 'pending') {
    return 'status-pending'
  }
  if (status === 'need_update') {
    return 'status-need-update'
  }
  return 'status-confirmed' // По умолчанию зеленый
}

const showUserSearch = () => {
  const memberCount = props.members.filter(member =>
      member.role.toUpperCase() === 'MEMBER' ||
      member.role.toUpperCase() === 'TEAMLEAD'
  ).length;

  if (memberCount >= 5) {
    return
  }
  emit('add-member')
}
</script>

<style scoped>
.team-members-section {
  margin-top: 0;
  padding-top: 0;
  border-top: none;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 1.25rem; /* text-xl */
  color: #1e293b; /* text-slate-800 */
  font-weight: 600;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.member-count {
  color: #64748b; /* text-slate-500 */
  font-size: 0.875rem; /* text-sm */
}

.add-member-btn {
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

.add-member-btn:hover {
  background: #eff6ff; /* bg-blue-50 */
}

.add-member-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Grid Layout */
.members-grid {
  display: grid;
  grid-template-columns: 1fr; /* grid-cols-1 */
  gap: 16px; /* gap-4 */
}

@media (min-width: 768px) {
  .members-grid {
    grid-template-columns: repeat(2, 1fr); /* md:grid-cols-2 */
  }
}

/* Member Card */
.member-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: white; /* bg-white */
  border: 1px solid #e2e8f0; /* border-slate-200 */
  border-radius: 8px; /* rounded-lg */
  transition: all 0.2s ease;
  position: relative;
}

.member-card:hover {
  border-color: #cbd5e1; /* border-slate-300 */
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
}

.member-avatar {
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

.member-info {
  flex: 1;
  min-width: 0; /* Для правильного обрезания текста */
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.member-name {
  font-size: 1rem; /* text-base */
  color: #1e293b; /* text-slate-800 */
  font-weight: 600;
  line-height: 1.4;
}

.member-role {
  font-size: 0.875rem; /* text-sm */
  color: #64748b; /* text-slate-500 */
  line-height: 1.4;
}

.member-actions {
  flex-shrink: 0;
  margin-left: auto;
}

.change-btn,
.remove-btn {
  padding: 6px 12px;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem; /* text-sm */
  font-weight: 500;
}

.change-btn {
  color: #2563eb;
  border: 1px solid #2563eb;
}

.change-btn:hover {
  background: #eff6ff;
}

.remove-btn {
  color: #ef4444; /* text-red-500 */
  border: 1px solid #ef4444; /* border-red-500 */
}

.remove-btn:hover {
  background: #fef2f2; /* bg-red-50 */
}

@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  .members-grid {
    grid-template-columns: 1fr;
  }
  
  .member-card {
    padding: 12px;
  }
  
  .member-name {
    font-size: 0.875rem; /* text-sm */
  }
  
  .member-role {
    font-size: 0.75rem; /* text-xs */
  }
}
</style>