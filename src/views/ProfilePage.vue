<template>
  <TheHeader></TheHeader>
  <div class="profile-container">
    <div class="profile-page">
      <div class="profile-sidebar">
        <div class="sidebar-menu">
          <div
              v-for="item in filteredMenuItems"
              :key="item.id"
              class="menu-item"
              :class="{ active: activeTab === item.id }"
              @click="activeTab = item.id"
          >
            {{ item.title }}
          </div>
        </div>
      </div>
      <div class="content-area">
        <div class="content-wrapper">
          <component
              :is="currentComponent"
          ></component>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed} from 'vue'
import TheHeader from "@/components/TheHeader.vue"
import TheFooter from "@/components/TheFooter.vue"
import ProfileData from '@/components/profile/ProfileData.vue'
import TeamInvites from '@/components/profile/TeamInvites.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const activeTab = ref('profile')

const menuItems = [
  {id: 'profile', title: 'Мои данные'},
  {
    id: 'invites',
    title: 'Приглашения в команду',
    showCondition: () => {
      // Show for mentors always, and for members (participants) only if they don't have a team
      return authStore.isMentor || (authStore.isMember && !authStore.isHaveTeam)
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
</script>

<style scoped>
.profile-container {
  height: calc(100vh - 125px);
  margin: 105px 20px 20px;
  display: flex;
  flex-direction: column;
}

.profile-page {
  background: var(--color-background);
  border-radius: 16px;
  display: flex;
  flex: 1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: 100%;
}

.profile-sidebar {
  width: 250px;
  background: linear-gradient(90deg, #00A3FF 0%, #5B51D8 100%);
  height: 100%;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
}

.sidebar-menu {
  padding: 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.menu-item {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  border: 2px solid transparent;
  white-space: nowrap;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid white;
}

.menu-item.active {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
}

.content-area {
  flex: 1;
  padding: 2rem;
  background: white;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 100%;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
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
  background: rgba(255, 255, 255, 0.2);
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
    height: auto;
    min-height: calc(100vh - 316px);
  }

  .profile-page {
    flex-direction: column;
    min-height: 500px;
    height: auto;
  }

  .profile-sidebar {
    width: 100%;
    min-height: auto;
    position: relative;
    height: auto;
  }

  .sidebar-menu {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10px;
    padding: 1rem;
  }

  .menu-item {
    flex: 1;
    min-width: 140px;
    text-align: center;
  }

  .content-area {
    padding: 1rem;
    height: auto;
  }
}
</style>