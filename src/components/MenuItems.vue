<template>
  <template v-if="!isAuthenticated">
    <el-menu-item index="1" @click="handleItemClick('application')">
      Подать заявку
    </el-menu-item>
    <el-menu-item index="2" @click="handleItemClick('login')">
      Вход
    </el-menu-item>
  </template>
  <template v-else>
    <template v-if="!isHaveTeam">
      <el-menu-item index="1" @click="handleItemClick('application')">
        Подать заявку
      </el-menu-item>
    </template>
    <template v-else>
      <el-menu-item index="1" @click="handleItemClick('my-team')">
        Моя команда
      </el-menu-item>
    </template>
    <el-menu-item index="3" @click="handleItemClick('profile')">
      Личный кабинет
    </el-menu-item>
    <el-menu-item index="4" @click="handleItemClick('logout')">
      Выход
    </el-menu-item>
  </template>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

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