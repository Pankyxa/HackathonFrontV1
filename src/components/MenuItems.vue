<template>
  <div class="menu-items-wrapper">
    <template v-if="!isAuthenticated">
      <el-menu-item index="1" @click="handleItemClick('application')">
        Подать заявку
      </el-menu-item>
      <el-menu-item index="2" @click="handleItemClick('login')">
        Вход
      </el-menu-item>
    </template>

    <template v-else>
      <el-menu-item
          v-if="authStore.isMentor"
          index="1"
          @click="handleItemClick('mentor-teams')"
      >
        Мои команды
      </el-menu-item>

      <el-menu-item
          v-if="authStore.isMember && !isHaveTeam"
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

      <el-menu-item index="3" @click="handleItemClick('profile')">
        Личный кабинет
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

const router = useRouter();
const authStore = useAuthStore();

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
</style>