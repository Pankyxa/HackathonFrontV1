<template>
  <Transition name="slide-down">
    <div v-if="showNotification" class="global-notification">
      <el-alert
          type="warning"
          :closable="true"
          show-icon
          @close="handleClose"
          class="notification-alert"
      >
        <template #title>
          <div class="notification-content">
            <div class="notification-text">
              <strong>Требуется обновление данных</strong>
              <p v-if="statusComment" class="comment-text">
                {{ statusComment }}
              </p>
              <p class="hint-text">
                Перейдите в <router-link to="/profile" class="profile-link">личный кабинет</router-link>, чтобы обновить информацию
              </p>
            </div>
            <el-button
                type="primary"
                size="small"
                @click="goToProfile"
                class="action-button"
            >
              Обновить данные
            </el-button>
          </div>
        </template>
      </el-alert>
    </div>
  </Transition>
</template>

<script setup>
import {ref, computed, onMounted, watch} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {useAuthStore} from '@/stores/auth'
import {storeToRefs} from 'pinia'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const {user} = storeToRefs(authStore)
const isDismissed = ref(false)

const showNotification = computed(() => {
  if (isDismissed.value) return false
  if (!user.value) return false
  if (user.value.current_status?.name === 'need_update') {
    // Не показываем на странице профиля, там уже есть уведомление
    return route.path !== '/profile'
  }
  return false
})

const statusComment = computed(() => {
  if (!user.value?.status_history?.length) return null
  const latestStatusWithComment = user.value.status_history
      .find(status => status.status.id === user.value.current_status.id)
  return latestStatusWithComment?.comment
})

const handleClose = () => {
  isDismissed.value = true
  // Сохраняем в localStorage, чтобы не показывать до следующего обновления статуса
  localStorage.setItem('need_update_notification_dismissed', 'true')
}

const goToProfile = () => {
  router.push('/profile')
}

// Сбрасываем флаг при изменении статуса
watch(() => user.value?.current_status?.name, (newStatus) => {
  if (newStatus !== 'need_update') {
    isDismissed.value = false
    localStorage.removeItem('need_update_notification_dismissed')
  }
})

onMounted(() => {
  // Проверяем, было ли уведомление закрыто
  const dismissed = localStorage.getItem('need_update_notification_dismissed')
  if (dismissed === 'true') {
    isDismissed.value = true
  }
})
</script>

<style scoped>
.global-notification {
  position: fixed;
  top: 90px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 40px);
  max-width: 1200px;
  z-index: 999;
  animation: slideDown 0.3s ease-out;
}

.notification-alert {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.notification-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
}

.notification-text {
  flex: 1;
}

.notification-text strong {
  display: block;
  font-size: 16px;
  margin-bottom: 8px;
  color: #E6A23C;
}

.comment-text {
  margin: 4px 0;
  font-size: 14px;
  color: #606266;
}

.hint-text {
  margin: 8px 0 0 0;
  font-size: 14px;
  color: #909399;
}

.profile-link {
  color: #409EFF;
  text-decoration: none;
  font-weight: 500;
}

.profile-link:hover {
  text-decoration: underline;
}

.action-button {
  white-space: nowrap;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  transform: translateX(-50%) translateY(-100%);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateX(-50%) translateY(-100%);
  opacity: 0;
}

@keyframes slideDown {
  from {
    transform: translateX(-50%) translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .global-notification {
    top: 80px;
    width: calc(100% - 20px);
  }

  .notification-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .action-button {
    width: 100%;
  }
}
</style>
