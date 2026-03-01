<template>
  <div class="status-change-page">
    <div class="page-header" :class="{ 'header-hidden': isHeaderHidden }">
      <div class="header-content">
        <el-button
          :icon="ArrowLeft"
          circle
          @click="handleCancel"
          class="back-button"
        />
        <h1 class="page-title">{{ dialogTitle }}</h1>
        <div class="header-spacer"></div>
      </div>
    </div>

    <div class="page-content">
      <div class="user-info-section" v-if="user">
        <div class="user-card">
          <div class="user-name">{{ user.full_name }}</div>
          <div class="user-email">{{ user.email }}</div>
        </div>
      </div>

      <div class="form-section">
        <el-form :model="form" :rules="rules" ref="formRef">
          <el-form-item
            :label="status === 'approved' ? 'Комментарий (необязательно)' : 'Комментарий'"
            prop="comment"
            :error="commentError"
            :required="status !== 'approved'"
          >
            <el-input
              v-model="form.comment"
              type="textarea"
              :rows="isMobile ? 6 : 4"
              :placeholder="status === 'approved' ? 'Комментарий (необязательно)' : 'Укажите причину изменения статуса'"
              class="comment-input"
            />
            <div v-if="commentError" class="error-message">
              {{ commentError }}
            </div>
          </el-form-item>
        </el-form>
      </div>

      <div class="actions-section">
        <el-button
          size="large"
          @click="handleCancel"
          class="cancel-button"
        >
          Отмена
        </el-button>
        <el-button
          type="primary"
          size="large"
          @click="handleConfirm"
          :disabled="!isValid"
          :loading="loading"
          class="confirm-button"
        >
          Подтвердить
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { usersApi } from '@/api/users'

const route = useRoute()
const router = useRouter()

const formRef = ref(null)
const loading = ref(false)
const isHeaderHidden = ref(false)
const lastScrollPosition = ref(0)
const scrollThreshold = 50

const form = ref({
  comment: ''
})

const user = ref(null)
const status = ref(null)

const rules = computed(() => {
  // Для статуса 'approved' комментарий необязателен
  if (status.value === 'approved') {
    return {}
  }
  return {
    comment: [
      { required: true, message: 'Комментарий обязателен', trigger: 'blur' }
    ]
  }
})

const commentError = computed(() => {
  // Для статуса 'approved' комментарий необязателен
  if (status.value === 'approved') {
    return ''
  }
  return !form.value.comment?.trim() ? 'Комментарий обязателен' : ''
})

const isValid = computed(() => {
  // Для статуса 'approved' комментарий необязателен
  if (status.value === 'approved') {
    return true
  }
  return !!form.value.comment?.trim()
})

const dialogTitle = computed(() => {
  const statusTexts = {
    approved: 'Подтверждение пользователя',
    need_update: 'Запрос обновления документов',
    rejected: 'Отклонение пользователя'
  }
  return statusTexts[status.value] || 'Изменение статуса'
})

const isMobile = computed(() => {
  return window.innerWidth <= 768
})

const handleScroll = () => {
  const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop

  if (currentScrollPosition < scrollThreshold) {
    isHeaderHidden.value = false
  } else if (currentScrollPosition > lastScrollPosition.value && currentScrollPosition > scrollThreshold) {
    isHeaderHidden.value = true
  } else {
    isHeaderHidden.value = false
  }

  lastScrollPosition.value = currentScrollPosition
}

const loadUserData = async () => {
  const userId = route.params.userId
  const statusParam = route.params.status

  if (!userId || !statusParam) {
    ElMessage.error('Неверные параметры')
    router.back()
    return
  }

  status.value = statusParam

  try {
    // Пытаемся получить данные из query параметров (если переданы)
    const userData = route.query.userData
    if (userData) {
      user.value = JSON.parse(decodeURIComponent(userData))
    } else {
      // Если данных нет в query, создаем минимальный объект из ID
      user.value = {
        id: userId,
        full_name: 'Пользователь',
        email: ''
      }
    }
  } catch (error) {
    console.error('Error loading user data:', error)
    // Создаем минимальный объект в случае ошибки
    user.value = {
      id: userId,
      full_name: 'Пользователь',
      email: ''
    }
  }
}

const handleConfirm = async () => {
  if (!isValid.value) {
    return
  }

  try {
    loading.value = true
    const userId = route.params.userId
    await usersApi.updateUserStatus(userId, status.value, form.value.comment)
    ElMessage.success('Статус пользователя успешно обновлен')
    // Возвращаемся назад и обновляем список
    router.back()
  } catch (error) {
    console.error('Error updating user status:', error)
    const errorMessage = error?.detail || error?.message || 'Ошибка при обновлении статуса'
    ElMessage.error(errorMessage)
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  router.back()
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  loadUserData()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.status-change-page {
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  flex-direction: column;
}

.page-header {
  position: sticky;
  top: 64px; /* Высота нового хедера */
  z-index: 100;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.page-header.header-hidden {
  transform: translateY(-100%);
}

.header-content {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.back-button {
  margin-right: 16px;
}

.page-title {
  flex: 1;
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.header-spacer {
  width: 40px;
}

.page-content {
  flex: 1;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.user-info-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.user-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.user-email {
  font-size: 14px;
  color: #909399;
}

.form-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.comment-input {
  width: 100%;
}

.comment-input :deep(.el-textarea__inner) {
  font-size: 14px;
  line-height: 1.6;
}

.error-message {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 4px;
}

.actions-section {
  display: flex;
  gap: 12px;
  padding: 20px 0;
}

.cancel-button,
.confirm-button {
  flex: 1;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
}

.cancel-button {
  background: white;
  border: 1px solid #dcdfe6;
  color: #606266;
}

.cancel-button:hover {
  background: #f5f7fa;
  border-color: #c0c4cc;
}

.confirm-button {
  font-weight: 600;
}

@media (max-width: 768px) {
  .page-content {
    padding: 16px;
    gap: 16px;
  }

  .header-content {
    padding: 12px 16px;
  }

  .page-title {
    font-size: 18px;
  }

  .user-info-section,
  .form-section {
    padding: 16px;
    border-radius: 8px;
  }

  .user-name {
    font-size: 16px;
  }

  .actions-section {
    position: sticky;
    bottom: 0;
    background: white;
    padding: 12px 16px;
    margin: 0 -16px -16px -16px;
    border-top: 1px solid #e4e7ed;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  }

  .cancel-button,
  .confirm-button {
    height: 44px;
    font-size: 15px;
  }
}
</style>
