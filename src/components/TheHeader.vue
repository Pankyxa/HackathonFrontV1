<template>
  <el-header class="header">
    <div class="header-content">
      <div class="logo">
        <router-link to="/">
          <img src="../assets/img/logo_top.png" alt="logo" height="40">
        </router-link>
      </div>
      <!-- Десктопное меню -->
      <div class="right-section desktop-menu">
        <el-menu
            mode="horizontal"
            :ellipsis="false"
            class="nav-menu"
        >
          <el-menu-item index="1">Подать заявку</el-menu-item>
          <template v-if="!isAuthenticated">
          <el-menu-item index="2" @click="router.push('/login')">Вход</el-menu-item>
          </template>
          <template v-else>
            <el-menu-item index="3">Личный кабинет</el-menu-item>
            <el-menu-item index="4" @click="handleLogout">Выход</el-menu-item>
</template>
        </el-menu>
      </div>

      <!-- Мобильное меню -->
      <div class="mobile-menu">
        <el-button class="hamburger-btn" @click="isMenuOpen = !isMenuOpen">
          <el-icon><Menu /></el-icon>
        </el-button>

        <div class="mobile-menu-dropdown" v-show="isMenuOpen">
          <el-menu mode="vertical" class="mobile-nav-menu">
            <el-menu-item index="1">Подать заявку</el-menu-item>
            <template v-if="!isAuthenticated">
              <el-menu-item index="2" @click="router.push('/login')">Вход</el-menu-item>
</template>
            <template v-else>
              <el-menu-item index="3">Личный кабинет</el-menu-item>
              <el-menu-item index="4" @click="handleLogout">Выход</el-menu-item>
            </template>
          </el-menu>
        </div>
      </div>
    </div>
  </el-header>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authApi } from '../api/auth';
import { Menu } from '@element-plus/icons-vue';

const router = useRouter();
const isAuthenticated = ref(false);
const isMenuOpen = ref(false);

// Функция для проверки аутентификации
const checkAuth = async () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      await authApi.getCurrentUser();
      isAuthenticated.value = true;
    } else {
      isAuthenticated.value = false;
    }
  } catch (error) {
    isAuthenticated.value = false;
    localStorage.removeItem('token');
  }
};

// Функция для выхода
const handleLogout = () => {
  authApi.logout();
  isAuthenticated.value = false;
  isMenuOpen.value = false;
  router.push('/login');
};

// Проверяем статус аутентификации при монтировании компонента
onMounted(() => {
  checkAuth();
});
</script>

<style scoped>
.header {
  padding: 0;
  margin: 5px;
  background: linear-gradient(90deg, #00A3FF 0%, #5B51D8 100%);
  height: 80px !important;
  border-radius: 16px;
  position: fixed;
  z-index: 1000;
  width: calc(100% - 10px);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 20px;
}

.logo img {
  height: 40px;
  object-fit: contain;
}

/* Стили для десктопного меню */
.desktop-menu {
  display: flex;
  align-items: center;
}

.nav-menu {
  border: none;
  background: transparent !important;
  height: 80px;
  display: flex;
  align-items: center;
}

/* Стили для мобильного меню */
.mobile-menu {
  display: none;
}

.hamburger-btn {
  background: transparent;
  border: 2px solid white;
  color: white;
  padding: 8px;
  font-size: 24px;
}

.mobile-menu-dropdown {
  position: absolute;
  top: 80px;
  right: 0;
  width: 100%;
  background: linear-gradient(90deg, #00A3FF 0%, #5B51D8 100%);
  border-radius: 0 0 16px 16px;
  z-index: 1000;
}

.mobile-nav-menu {
  background: transparent !important;
  border: none;
  padding: 10px;
}

:deep(.el-menu--horizontal .el-menu-item) {
  color: white !important;
  border: 2px solid white !important;
  border-radius: 8px;
  margin-right: 16px;
  padding: 0 20px;
  height: 40px;
  line-height: 36px;
}

:deep(.el-menu--horizontal .el-menu-item:hover) {
  background-color: rgba(255, 255, 255, 0.1) !important;
  color: white !important;
}

:deep(.el-menu--horizontal) {
  border: none !important;
}

:deep(.el-menu-item.is-active) {
  background-color: rgba(255, 255, 255, 0.1) !important;
  color: white !important;
}

/* Стили для мобильного меню */
:deep(.mobile-nav-menu .el-menu-item) {
  color: white !important;
  border: 2px solid white !important;
  border-radius: 8px;
  margin-bottom: 8px;
  padding: 0 20px;
  height: 40px;
  line-height: 36px;
  justify-content: center;
  text-align: center;
}

/* Медиа-запрос для мобильных устройств */
@media (max-width: 768px) {
  .desktop-menu {
    display: none;
  }

  .mobile-menu {
    display: block;
  }

  .header {
    margin: 5px; /* Возвращаем отступы как в десктопной версии */
    border-radius: 16px; /* Возвращаем скругление углов */
    width: calc(100% - 10px); /* Учитываем отступы с обеих сторон */
  }

  .mobile-menu-dropdown {
    position: fixed;
    top: 80px;
    left: 5px; /* Добавляем отступ слева */
    right: 5px; /* Добавляем отступ справа */
    width: calc(100% - 10px); /* Учитываем отступы */
    margin: 0;
    border-radius: 16px; /* Добавляем скругление для выпадающего меню */
  }

  .header-content {
    padding: 0 15px; /* Немного уменьшаем горизонтальные отступы для мобильной версии */
  }
}
</style>