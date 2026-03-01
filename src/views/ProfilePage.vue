<template>
  <TheHeader></TheHeader>
  <div class="profile-container">
    <div class="profile-page">
      <div class="profile-sidebar">
        <div class="sidebar-header">
          <h3>Личный кабинет</h3>
        </div>
        <div class="sidebar-menu">
          <div
              v-for="item in filteredMenuItems"
              :key="item.id"
              class="menu-item"
              :class="{ active: activeTab === item.id }"
              @click="activeTab = item.id"
          >
            <el-icon class="menu-icon">
              <component :is="getMenuIcon(item.id)" />
            </el-icon>
            <span>{{ item.title }}</span>
            <span v-if="item.id === 'invites' && hasInvites" class="notification-badge">
              {{ invitesCount > 0 ? invitesCount : '' }}
            </span>
          </div>
        </div>
      </div>
      <div class="content-area">
        <div class="content-wrapper">
          <component
              :is="currentComponent"
              @changeTab="handleTabChange"
          ></component>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import {User, Bell} from '@element-plus/icons-vue'
import TheHeader from "@/components/TheHeader.vue"
import ProfileData from '@/components/profile/ProfileData.vue'
import TeamInvites from '@/components/profile/TeamInvites.vue'
import { useAuthStore } from '@/stores/auth'
import { useStageStore } from '@/stores/stage'
import {useRoute} from "vue-router";
import { useTeamInvites } from '@/composables/useTeamInvites.js';

const route = useRoute()
const stageStore = useStageStore()
const authStore = useAuthStore()
const activeTab = ref('profile')
const { hasInvites, invitesCount } = useTeamInvites()

const menuItems = [
  {id: 'profile', title: 'Мои данные'},
  {
    id: 'invites',
    title: 'Приглашения в команду',
    showCondition: () => {
      const userCanReceiveInvites = authStore.isMentor || (authStore.isMember && !authStore.isHaveTeam);
      return stageStore.isRegistration && userCanReceiveInvites;
    }
  }
]

const filteredMenuItems = computed(() => {
  return menuItems.filter(item => {
    if (!item.showCondition) return true
    return item.showCondition()
  })
})

const currentComponent = computed(() => {
  switch (activeTab.value) {
    case 'profile':
      return ProfileData
    case 'invites':
      return TeamInvites
    default:
      return null
  }
})

const handleTabChange = (tabId) => {
  activeTab.value = tabId
}

const getMenuIcon = (itemId) => {
  const icons = {
    'profile': User,
    'invites': Bell
  }
  return icons[itemId] || User
}

onMounted(() => {
  if (route.query.tab) {
    activeTab.value = route.query.tab
  }
})
</script>

<style scoped>
.profile-container {
  min-height: 100vh; /* min-h-screen - позволяет контенту расширяться */
  width: 100%; /* w-full */
  margin: 64px 0 0 0; /* Отступ для фиксированного хедера */
  padding: 0;
  display: flex; /* flex */
  background-color: #f8fafc; /* bg-slate-50 */
}

.profile-page {
  display: flex;
  flex: 1;
  width: 100%;
  min-height: calc(100vh - 64px); /* Минимальная высота для заполнения экрана */
  background: transparent;
  border-radius: 0;
  box-shadow: none;
  max-width: none;
}

.profile-sidebar {
  width: 280px; /* w-64 equivalent */
  background: white; /* bg-white */
  border-right: 1px solid #e2e8f0; /* border-r border-slate-200 */
  height: calc(100vh - 64px); /* Высота минус хедер */
  position: fixed; /* Фиксированный сайдбар */
  top: 64px; /* Отступ от хедера */
  left: 0; /* Прижат к левому краю */
  display: flex;
  flex-direction: column;
  flex-shrink: 0; /* Не сжимается */
  overflow-y: auto; /* Скролл если меню длинное */
  z-index: 10; /* Поверх контента */
}

.sidebar-header {
  padding: 24px 20px;
  border-bottom: 1px solid #e2e8f0; /* border-slate-200 */
}

.sidebar-header h3 {
  margin: 0;
  color: #1e293b; /* text-slate-800 */
  font-size: 20px;
  font-weight: 600;
}

.sidebar-menu {
  padding: 16px 0; /* Убираем горизонтальный padding, оставляем только вертикальный */
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 4px; /* Уменьшаем gap между элементами */
  overflow-y: auto; /* Скролл если меню длинное */
}

.menu-item {
  padding: 14px 20px; /* Увеличиваем вертикальный padding для touch targets */
  border-radius: 0; /* Убираем скругления */
  cursor: pointer;
  transition: all 0.2s ease;
  color: #475569; /* text-slate-600 - неактивное состояние */
  background: transparent;
  border: none;
  border-left: 4px solid transparent; /* Место для акцентной линии */
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
  font-size: 15px;
  position: relative;
  margin: 0 8px; /* Небольшой горизонтальный отступ */
}

.menu-item:hover {
  background: #f1f5f9; /* hover:bg-slate-50 */
}

.menu-item.active {
  background: #eff6ff; /* bg-blue-50 */
  color: #2563eb; /* text-blue-600 */
  font-weight: 600;
  border-left: 4px solid #2563eb; /* border-l-4 border-blue-600 */
}

.menu-icon {
  font-size: 20px;
  color: inherit; /* Наследует цвет от родителя */
}

.menu-item.active .menu-icon {
  color: #2563eb; /* text-blue-600 для активного состояния */
}

.notification-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  min-width: 18px;
  height: 18px;
  background-color: #f56565;
  border-radius: 9px;
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  color: white;
  padding: 0 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.content-area {
  flex: 1; /* flex-1 */
  margin-left: 280px; /* Отступ для фиксированного сайдбара */
  min-height: calc(100vh - 64px); /* Минимальная высота для заполнения экрана */
  overflow-y: auto; /* overflow-y-auto - скролл внутри этой области */
  padding: 32px; /* p-8 */
  background: #f8fafc; /* bg-slate-50 - фон страницы, не белая карточка */
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  flex: 1;
}

.profile-header-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
}

.menu-logo-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e2e8f0; /* bg-slate-200 */
}

.profile-title {
  font-weight: 500;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 768px) {
  .profile-container {
    flex-direction: column;
    height: calc(100vh - 64px);
    overflow: hidden;
    margin-top: 64px; /* Отступ для хедера */
  }

  .profile-page {
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex: 1;
  }

  .profile-sidebar {
    width: 100%;
    position: relative;
    height: auto;
    top: 0;
    left: 0;
    border-right: none;
    border-bottom: 1px solid #e2e8f0; /* border-slate-200 */
    overflow: visible;
    z-index: 1;
  }

  .sidebar-header {
    padding: 16px 20px;
  }

  .sidebar-header h3 {
    font-size: 18px;
  }

  .sidebar-menu {
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 8px;
    padding: 12px 16px;
    overflow-x: auto;
    overflow-y: visible;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .sidebar-menu::-webkit-scrollbar {
    display: none;
  }

  .menu-item {
    flex: 0 0 auto;
    min-width: 140px;
    text-align: center;
    justify-content: center;
    margin: 0;
    padding: 12px 16px;
    border-left: none;
    border-bottom: 2px solid transparent;
    font-size: 14px;
    position: relative;
    white-space: nowrap;
  }
  
  .menu-item.active {
    border-left: none;
    border-bottom: 2px solid #2563eb;
  }

  .menu-icon {
    font-size: 18px;
  }

  .menu-item .notification-badge {
    top: 4px;
    right: 4px;
  }

  .content-area {
    margin-left: 0; /* Убираем отступ для сайдбара на мобилке */
    padding: 16px; /* Компактный padding */
    flex: 1;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 0; /* Важно для flex-скролла */
  }

  .content-wrapper {
    width: 100%;
    max-width: 100%;
    margin: 0;
  }
}
</style>