<template>
  <el-header class="header" :class="{ 'header-hidden': isHeaderHidden, 'menu-open': isMenuOpen }">
    <GlobalNotification />
    <div class="header-content">
      <div class="logo desktop-menu">
        <router-link to="/">
          <img src="../assets/img/logo_top.png" alt="logo" height="40">
        </router-link>
      </div>

      <div class="right-section desktop-menu">
        <el-menu
            mode="horizontal"
            :ellipsis="false"
            class="nav-menu"
        >
          <template v-if="(!isLoading)">
            <MenuItems
                :is-authenticated="authStore.isAuthenticated"
                :is-have-team="authStore.isHaveTeam"
                @application-click="handleApplicationClick"
                @logout="handleLogout"
            />
          </template>
        </el-menu>
      </div>

      <div class="mobile-menu" ref="mobileMenuRef">
        <div class="mobile-header">
          <router-link to="/" class="mobile-logo">
            <img src="../assets/img/logo_top.png" alt="logo" height="40">
          </router-link>
          <el-button class="hamburger-btn" @click="toggleMobileMenu">
            <el-icon>
              <Menu/>
            </el-icon>
            <span v-if="hasInvites" class="hamburger-notification-badge"></span>
          </el-button>
        </div>

        <Transition name="slide-fade">
          <div class="mobile-menu-dropdown" v-show="isMenuOpen">
            <el-menu mode="vertical" class="mobile-nav-menu">
              <template v-if="(!isLoading)">
                <MenuItems
                    :is-authenticated="authStore.isAuthenticated"
                    :is-have-team="authStore.isHaveTeam"
                    :is-member="authStore.isMember"
                    :is-mentor="authStore.isMentor"
                    :is-admin="authStore.isAdmin"
                    :is-judge="authStore.isJudge"
                    :is-organizer="authStore.isOrganizer"
                    @application-click="handleMobileMenuItemClick('application')"
                    @logout="handleMobileMenuItemClick('logout')"
                    @menu-item-click="handleMobileMenuItemClick"
                />
              </template>
            </el-menu>
          </div>
        </Transition>
      </div>
    </div>

    <AuthRequiredModal v-model="showAuthModal"/>
  </el-header>
</template>

<script setup>
import {ref, onMounted, onBeforeUnmount} from 'vue'
import {useRouter} from 'vue-router'
import {Menu} from '@element-plus/icons-vue'
import AuthRequiredModal from "@/components/auth/AuthRequiredModal.vue"
import MenuItems from './MenuItems.vue'
import GlobalNotification from './GlobalNotification.vue'
import {useAuthStore} from '@/stores/auth'
import {useLoadingStore} from "@/stores/loading.js";
import {storeToRefs} from "pinia";
import { useTeamInvites } from '@/composables/useTeamInvites.js';

const props = defineProps({
  isHeaderHidden: {
    type: Boolean,
    default: false
  }
});

const router = useRouter()
const authStore = useAuthStore()
const { hasInvites } = useTeamInvites()
const isMenuOpen = ref(false)
const showAuthModal = ref(false)
const mobileMenuRef = ref(null)
const store = useLoadingStore()
const {isLoading} = storeToRefs(store)
const handleApplicationClick = () => {
  if (!authStore.isAuthenticated) {
    showAuthModal.value = true
    closeMobileMenu()
  } else {
    router.push('/team/apply')
    closeMobileMenu()
  }
}
const handleLogout = () => {
  authStore.logout()
  closeMobileMenu()
  router.push('/login')
}
const toggleMobileMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
const closeMobileMenu = () => {
  isMenuOpen.value = false
}
const handleMobileMenuItemClick = (action) => {
  switch (action) {
    case 'application':
      handleApplicationClick()
      break
    case 'login':
      router.push('/login')
      break
    case 'profile':
      router.push('/profile')
      break
    case 'logout':
      handleLogout()
      break
  }
  closeMobileMenu()
}
const handleClickOutside = (event) => {
  if (mobileMenuRef.value && !mobileMenuRef.value.contains(event.target)) {
    closeMobileMenu()
  }
}
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  authStore.initializeAuth()
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.header {
  padding: 0;
  margin: 0;
  background: linear-gradient(90deg, #1e40af 0%, #1e3a8a 50%, #1e40af 100%); /* Глубокий синий градиент */
  height: 64px !important; /* Компактная высота */
  border-radius: 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  width: 100%;
  max-width: 100%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
  overflow: hidden;
  overflow-x: hidden;
}

.header-hidden {
  transform: translateY(-100%);
}

.header.menu-open {
  height: auto !important;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}

.logo img {
  height: 40px;
  object-fit: contain;
}

.desktop-menu {
  display: flex;
  align-items: center;
}

.nav-menu {
  border: none;
  background: transparent !important;
  height: 64px;
  display: flex;
  align-items: center;
}

.mobile-menu {
  position: relative;
  z-index: 1000;
  display: none;
}

.mobile-menu-dropdown {
  position: absolute;
  top: 64px;
  right: 0;
  background: linear-gradient(90deg, #1e40af 0%, #1e3a8a 50%, #1e40af 100%);
  border-radius: 8px;
  min-width: 200px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.mobile-nav-menu {
  background: transparent !important;
  border: none;
  padding: 10px;
}

:deep(.el-menu--horizontal .el-menu-item) {
  color: white !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  background: transparent !important;
  border-radius: 6px;
  margin-right: 12px;
  padding: 0 16px;
  height: 36px;
  line-height: 34px;
  font-size: 14px;
  transition: all 0.2s ease;
}

:deep(.el-menu--horizontal .el-menu-item:hover) {
  background-color: rgba(255, 255, 255, 0.08) !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  color: white !important;
}

:deep(.el-menu--horizontal) {
  border: none !important;
}

:deep(.el-menu-item.is-active) {
  background-color: rgba(255, 255, 255, 0.12) !important;
  border-color: rgba(255, 255, 255, 0.6) !important;
  color: white !important;
}

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

.dialog-footer {
  display: flex;
  justify-content: center;
  width: 100%;
}

:deep(.el-dialog) {
  border-radius: 16px;
}

:deep(.el-dialog__header) {
  text-align: center;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

@media (max-width: 768px) {
  .header {
    transition: transform 0.3s ease, height 0.3s ease;
    height: 64px !important;
    padding: 0;
    overflow: hidden;
  }

  .header.menu-open {
    height: auto !important;
  }

  .header-content {
    padding: 0 20px;
    flex-direction: column;
    height: auto;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    overflow-x: hidden;
  }

  .desktop-menu {
    display: none;
  }

  .mobile-menu {
    display: block;
    width: 100%;
  }

  .mobile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 64px;
    width: 100%;
    max-width: 100%;
    position: relative;
    z-index: 2;
    background: linear-gradient(90deg, #1e40af 0%, #1e3a8a 50%, #1e40af 100%);
    box-sizing: border-box;
    overflow-x: hidden;
  }

  .mobile-logo {
    display: flex;
    align-items: center;
  }

  .hamburger-btn {
    display: flex;
    position: relative;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 8px;
    font-size: 24px;
    transition: all 0.2s ease;
  }

  .hamburger-btn:hover {
    background-color: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.5);
  }

  .hamburger-notification-badge {
    position: absolute;
    top: 2px;
    right: 2px;
    width: 8px;
    height: 8px;
    background-color: #f56565;
    border-radius: 50%;
    border: 1.5px solid #1e40af;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.9);
    z-index: 10;
  }

  .mobile-menu-dropdown {
    position: initial;
    width: 100%;
    background: transparent;
    box-shadow: none;
    padding: 20px 0;
    z-index: 1;
    transform-origin: top;
  }

  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: all 0.3s ease;
    max-height: 400px;
  }

  .slide-fade-enter-from,
  .slide-fade-leave-to {
    max-height: 0;
    opacity: 0;
    margin-top: -20px;
  }

  .mobile-nav-menu {
    width: 100%;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: transparent !important;
  }

  :deep(.mobile-nav-menu .el-menu-item) {
    margin: 0;
    width: 100%;
    height: 44px;
    line-height: 42px;
    font-size: 14px;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.3) !important;
    background: transparent !important;
    border-radius: 6px;
    margin-bottom: 8px;
  }

  .mobile-header {
    position: sticky;
    top: 0;
  }
}
</style>
