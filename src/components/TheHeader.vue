<template>
  <el-header class="header">
    <div class="header-content">
      <div class="logo">
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
        <el-button class="hamburger-btn" @click="toggleMobileMenu">
          <el-icon>
            <Menu/>
          </el-icon>
        </el-button>

        <Transition name="slide-fade">
          <div class="mobile-menu-dropdown" v-show="isMenuOpen">
            <el-menu mode="vertical" class="mobile-nav-menu">
              <template v-if="(!isLoading)">
                <MenuItems
                    :is-authenticated="authStore.isAuthenticated"
                    :is-have-team="authStore.isHaveTeam"
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
import {useAuthStore} from '@/stores/auth'
import {useLoadingStore} from "@/stores/loading.js";
import {storeToRefs} from "pinia";

const router = useRouter()
const authStore = useAuthStore()
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

.mobile-menu {
  position: relative;
  z-index: 1000;
  display: none;
}

.mobile-menu-dropdown {
  position: absolute;
  top: 60px;
  right: 0;
  background: linear-gradient(90deg, #00A3FF 0%, #5B51D8 100%);
  border-radius: 16px;
  min-width: 200px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
  .desktop-menu {
    display: none;
  }

  .mobile-menu {
    display: block;
  }

  .mobile-menu-dropdown {
    position: fixed;
    top: 80px;
    left: 5px;
    right: 5px;
    width: calc(100% - 10px);
    margin: 0;
    border-radius: 16px;
  }

  .hamburger-btn {
    background: transparent;
    border: 2px solid white;
    color: white;
    padding: 8px;
    font-size: 24px;
    transition: background-color 0.3s ease;
  }

  .hamburger-btn:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .header-content {
    padding: 0 15px;
  }

  :deep(.mobile-nav-menu .el-menu-item) {
    margin: 8px 16px;
    transition: transform 0.2s ease;
  }

  :deep(.mobile-nav-menu .el-menu-item:active) {
    transform: scale(0.98);
  }
}
</style>