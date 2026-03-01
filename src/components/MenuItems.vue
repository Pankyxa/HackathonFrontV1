<template>
  <div class="menu-items-wrapper">
    <template v-if="!isAuthenticated">
      <el-menu-item v-if="stageStore.isRegistration" index="1" @click="handleItemClick('application')">
        Подать заявку
      </el-menu-item>
      <el-menu-item index="2" @click="handleItemClick('login')">
        Вход
      </el-menu-item>
    </template>

    <template v-else>
      <el-menu-item
          v-if="authStore.isJudge"
          index="judge"
          @click="handleItemClick('judge')"
      >
        Оценка работ
      </el-menu-item>

      <el-menu-item
          v-if="authStore.isOrganizer"
          index="organizer"
          @click="handleItemClick('organizer')"
      >
        Для организаторов
      </el-menu-item>

      <el-menu-item
          v-if="authStore.isAdmin"
          index="admin"
          @click="handleItemClick('admin')"
      >
        Админ меню
      </el-menu-item>

      <el-menu-item
          v-if="authStore.isMentor"
          index="1"
          @click="handleItemClick('mentor-teams')"
      >
        Мои команды
      </el-menu-item>

      <el-menu-item
          v-if="authStore.isMember && !isHaveTeam && stageStore.isRegistration"
          index="1"
          @click="handleItemClick('application')"
      >
        Подать заявку
      </el-menu-item>

      <el-menu-item
          v-if="authStore.isMember && isHaveTeam"
          index="1"
          @click="handleItemClick('my-team')"
      >
        Моя команда
      </el-menu-item>

      <el-menu-item index="3" @click="handleItemClick('profile')" class="profile-menu-item">
        Личный кабинет
        <span v-if="hasInvites" class="notification-badge"></span>
      </el-menu-item>
      <el-menu-item index="4" @click="handleItemClick('logout')">
        Выход
      </el-menu-item>
    </template>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.js';
import { useStageStore } from '@/stores/stage.js';
import { useTeamInvites } from '@/composables/useTeamInvites.js';

const router = useRouter();
const authStore = useAuthStore();
const stageStore = useStageStore();
const { hasInvites } = useTeamInvites();

const props = defineProps({
  isAuthenticated: {
    type: Boolean,
    required: true
  },
  isHaveTeam: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['applicationClick', 'logout', 'menuItemClick']);

const handleItemClick = (action) => {
  emit('menuItemClick');

  switch (action) {
    case 'judge':
      router.push('/judge/teams');
      break;
    case 'admin':
      router.push('/admin');
      break;
    case 'organizer':
      router.push('/organizer');
      break;
    case 'mentor-teams':
      router.push('/mentor/teams');
      break;
    case 'application':
      emit('applicationClick');
      break;
    case 'my-team':
      router.push('/team');
      break;
    case 'login':
      router.push('/login');
      break;
    case 'profile':
      router.push('/profile');
      break;
    case 'logout':
      emit('logout');
      break;
  }
};
</script>

<style scoped>
.menu-items-wrapper {
  display: contents;
}

.profile-menu-item {
  position: relative;
}

.notification-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 10px;
  height: 10px;
  background-color: #f56565;
  border-radius: 50%;
  border: 2px solid #1e40af;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.8);
  z-index: 10;
}

:deep(.el-menu-item) {
  position: relative;
}
</style>