<template>
  <div class="user-documents-page">
    <TheHeader />
    <div class="page-header">
      <div class="header-content">
        <el-button
          :icon="ArrowLeft"
          circle
          @click="handleBack"
          class="back-button"
        />
        <h1 class="page-title">Проверка документов пользователя</h1>
        <div class="header-spacer"></div>
      </div>
    </div>

    <div class="page-content" v-loading="loading">
      <UserInfo :user="user" v-if="user" />

      <DocumentsSection
        :loading="documentsLoading"
        :documents="documents"
      />

      <div class="actions-section">
        <el-button
          type="warning"
          size="large"
          @click="handleStatusChange('need_update')"
          :loading="statusLoading"
        >
          Отправить на изменение личных данных
        </el-button>
        <el-button
          type="success"
          size="large"
          @click="handleStatusChange('approved')"
          :loading="statusLoading"
        >
          Подтвердить
        </el-button>
      </div>
    </div>

    <!-- Модальное окно для изменения статуса -->
    <StatusChangeDialog
      v-model:visible="statusDialogVisible"
      v-model:comment="statusComment"
      :status="pendingStatus"
      @confirm="confirmStatusChange"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { usersApi } from '@/api/users'
import UserInfo from '@/components/organizer/UserInfo.vue'
import DocumentsSection from '@/components/organizer/DocumentsSection.vue'
import StatusChangeDialog from '@/components/organizer/StatusChangeDialog.vue'
import TheHeader from '@/components/TheHeader.vue'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const documentsLoading = ref(false)
const statusLoading = ref(false)
const user = ref(null)
const documents = ref([])

const statusDialogVisible = ref(false)
const statusComment = ref('')
const pendingStatus = ref(null)

const loadUserData = async () => {
  const userId = route.params.userId

  if (!userId) {
    ElMessage.error('Неверные параметры')
    router.back()
    return
  }

  try {
    loading.value = true
    // Загружаем данные пользователя из query параметров
    const userData = route.query.userData
    if (userData) {
      user.value = JSON.parse(decodeURIComponent(userData))
    }
    
    // Загружаем документы
    await loadDocuments(userId)
  } catch (error) {
    console.error('Error loading user data:', error)
    ElMessage.error('Ошибка при загрузке данных пользователя')
  } finally {
    loading.value = false
  }
}

const loadDocuments = async (userId) => {
  try {
    documentsLoading.value = true
    documents.value = await usersApi.getUserDocuments(userId)
  } catch (error) {
    console.error('Error loading documents:', error)
    ElMessage.error('Ошибка при загрузке документов')
  } finally {
    documentsLoading.value = false
  }
}

const handleStatusChange = (status) => {
  pendingStatus.value = status
  statusComment.value = ''
  statusDialogVisible.value = true
}

const confirmStatusChange = async () => {
  if (!user.value) return

  try {
    statusLoading.value = true
    await usersApi.updateUserStatus(user.value.id, pendingStatus.value, statusComment.value)
    ElMessage.success('Статус пользователя успешно обновлен')
    statusDialogVisible.value = false
    // Возвращаемся назад
    router.back()
  } catch (error) {
    console.error('Error updating user status:', error)
    const errorMessage = error?.detail || error?.message || 'Ошибка при обновлении статуса'
    ElMessage.error(errorMessage)
  } finally {
    statusLoading.value = false
  }
}

const handleBack = () => {
  router.back()
}

onMounted(() => {
  loadUserData()
})
</script>

<style scoped>
.user-documents-page {
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  flex-direction: column;
  margin-top: 64px; /* Отступ для основного хедера */
}

.page-header {
  position: sticky;
  top: 64px; /* Высота основного хедера */
  z-index: 100;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.actions-section {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
}

@media (max-width: 768px) {
  .page-content {
    padding: 16px;
    gap: 16px;
    padding-bottom: 120px; /* Увеличиваем отступ снизу для фиксированных кнопок */
    margin-bottom: 0;
  }

  .header-content {
    padding: 12px 16px;
  }

  .page-title {
    font-size: 18px;
  }

  .actions-section {
    flex-direction: column;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background: white;
    padding: 12px 16px;
    margin: 0;
    border-top: 1px solid #e4e7ed;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
    z-index: 100;
    gap: 8px;
  }

  .actions-section .el-button {
    width: 100%;
    height: 44px;
    font-size: 15px;
    margin: 0;
  }
}
</style>
