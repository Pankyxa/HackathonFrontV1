<template>
  <div class="profile-data">
    <div class="header-actions">
      <div v-if="showStatusMessage" class="status-message">
        <div class="status-alert">
          <div class="alert-icon">
            <el-icon><Warning /></el-icon>
          </div>
          <div class="alert-content">
            <p class="alert-title">Требуется обновление данных</p>
            <p v-if="latestStatusComment" class="status-comment">
              <strong>Комментарий:</strong> {{ latestStatusComment }}
            </p>
            <p class="status-hint">
              Вы можете редактировать данные и документы, затем нажмите "Отправить на проверку"
            </p>
          </div>
        </div>
      </div>
      <div class="header-content">
        <div class="title-section">
          <div class="title-with-badge">
            <h2>Мои данные</h2>
            <span v-if="userData?.current_status" class="status-badge" :class="statusClass">
              <span class="status-icon"></span>
              {{
                !stageStore.isRegistration && userData.current_status.name !== 'approved' ?
                  "Регистрация закрыта, вы не можете учавствовать в хакатоне" :
                  userData.current_status.description
              }}
            </span>
          </div>
          <p class="subtitle">Управление личной информацией и документами</p>
        </div>
        <div class="header-right">
          <div v-if="canEdit" class="action-buttons">
            <button
                class="btn-edit"
                @click="showEditModal = true"
            >
              Редактировать данные
            </button>
            <button
                class="btn-submit"
                @click="handleSubmitForReview"
                :loading="isSubmitting"
            >
              Отправить на проверку
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Card 1: My Data -->
    <div class="data-card" v-if="userData">
      <div class="info-grid">
        <div class="info-item">
          <label>ФИО:</label>
          <span>{{ userData.full_name }}</span>
        </div>
        <div class="info-item">
          <label>Email:</label>
          <span>{{ userData.email }}</span>
        </div>
        <div class="info-item">
          <label>Роли:</label>
          <span>{{ formatRoles(userData.roles) }}</span>
        </div>
        <div class="info-item">
          <label>Дата регистрации:</label>
          <span>{{ formatDate(userData.registered_at) }}</span>
        </div>

        <template v-if="hasParticipantRole">
          <div class="info-item">
            <label>Номер телефона:</label>
            <span>{{ userData.participant_info?.number }}</span>
          </div>
          <div class="info-item">
            <label>ВУЗ:</label>
            <span>{{ userData.participant_info?.vuz }}</span>
          </div>
          <div class="info-item">
            <label>Направление:</label>
            <span>{{ userData.participant_info?.vuz_direction }}</span>
          </div>
          <div class="info-item">
            <label>Специальность:</label>
            <span>{{ userData.participant_info?.code_speciality }}</span>
          </div>
          <div class="info-item">
            <label>Курс:</label>
            <span>{{ userData.participant_info?.course }}</span>
          </div>
        </template>

        <template v-if="hasMentorRole">
          <div class="info-item">
            <label>Номер телефона:</label>
            <span>{{ userData.mentor_info?.number }}</span>
          </div>
          <div class="info-item">
            <label>Место работы:</label>
            <span>{{ userData.mentor_info?.job }}</span>
          </div>
          <div class="info-item">
            <label>Должность:</label>
            <span>{{ userData.mentor_info?.job_title }}</span>
          </div>
        </template>
      </div>
    </div>

    <!-- Card 2: My Documents -->
    <div class="documents-card" v-if="userData && (hasMentorRole || hasParticipantRole)">
      <h3 class="card-title">Мои документы</h3>
      <UserDocuments
          :can-edit="canEdit"
          :user-data="userData"
          @update="handleDocumentsUpdate"
      />
    </div>

    <EditProfileDialog
        v-if="showEditModal"
        :user-data="userData"
        @close="showEditModal = false"
        @update="handleUpdate"
    />
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import {authApi} from "@/api/auth.js"
import {usersApi} from "@/api/users.js"
import {ElMessage} from 'element-plus'
import {Warning} from '@element-plus/icons-vue'
import EditProfileDialog from './EditProfileDialog.vue'
import UserDocuments from './UserDocuments.vue'
import {useStageStore} from "@/stores/stage.js"

const stageStore = useStageStore()

const userData = ref(null)
const showEditModal = ref(false)
const isSubmitting = ref(false)

const canEdit = computed(() => {
  return userData.value?.current_status.name === 'need_update'
})

const showStatusMessage = computed(() => {
  return userData.value?.current_status.name === 'need_update'
})

const latestStatusComment = computed(() => {
  if (!userData.value?.status_history?.length) return null

  const latestStatusWithComment = userData.value.status_history
      .find(status => status.status.id === userData.value.current_status.id)
  return latestStatusWithComment?.comment
})

const hasParticipantRole = computed(() => {
  return userData.value?.roles?.some(role => role.name === 'participant')
})

const hasMentorRole = computed(() => {
  return userData.value?.roles?.some(role => role.name === 'mentor')
})

const statusClass = computed(() => {
  const statusName = userData.value?.current_status?.name
  if (!stageStore.isRegistration && statusName !== 'approved') {
    return 'status-need-update'
  }

  return {
    'status-pending': statusName === 'pending',
    'status-approved': statusName === 'approved',
    'status-need-update': statusName === 'need_update',
  }
})

const formatDate = (date) => {
  return new Date(date).toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatRoles = (roles) => {
  if (!roles || !roles.length) return '—'
  return roles.map(role => role.description).join(', ')
}

const handleUpdate = async (updatedData) => {
  userData.value = updatedData
  showEditModal.value = false
  // Не меняем статус автоматически - пользователь должен отправить на проверку вручную
  // Обновляем данные пользователя из API
  try {
    const userInfo = await authApi.getCurrentUser()
    if (userInfo) {
      userData.value = userInfo
    }
  } catch (error) {
    console.error('Error refreshing user data:', error)
  }
}

const handleDocumentsUpdate = async (updatedData) => {
  userData.value = updatedData
  // Не меняем статус автоматически - пользователь должен отправить на проверку вручную
  // Обновляем данные пользователя из API
  try {
    const userInfo = await authApi.getCurrentUser()
    if (userInfo) {
      userData.value = userInfo
    }
  } catch (error) {
    console.error('Error refreshing user data:', error)
  }
}

const handleSubmitForReview = async () => {
  if (!canEdit.value) return

  isSubmitting.value = true
  try {
    const updatedUser = await usersApi.submitForReview()
    userData.value = updatedUser
    ElMessage.success('Данные отправлены на проверку')
    
    // Обновляем данные пользователя из API
    const userInfo = await authApi.getCurrentUser()
    if (userInfo) {
      userData.value = userInfo
    }
  } catch (error) {
    console.error('Error submitting for review:', error)
    const errorMessage = error?.detail || error?.message || 'Ошибка при отправке на проверку'
    ElMessage.error(errorMessage)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  try {
    const userInfo = await authApi.getCurrentUser()
    if (userInfo) {
      userData.value = userInfo
    }
  } catch (error) {
    console.error('Error loading user data:', error)
  }
})
</script>

<style scoped>
.profile-data {
  display: flex;
  flex-direction: column;
  gap: 24px; /* gap-6 */
  width: 100%;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-actions {
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
  width: 100%;
}

h2 {
  margin: 0;
  color: #333333;
}

/* Card Styles */
.data-card,
.documents-card {
  background: white; /* bg-white */
  border-radius: 12px; /* rounded-xl */
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1); /* shadow-sm */
  border: 1px solid #e2e8f0; /* border border-slate-200 */
  padding: 24px; /* p-6 */
}

.data-card {
  margin-bottom: 24px; /* mb-6 */
}

.card-title {
  font-size: 1.25rem; /* text-xl */
  font-weight: 600;
  color: #1e293b; /* text-slate-800 */
  margin: 0 0 20px 0;
}

.title-with-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item label {
  font-weight: 500;
  color: #606266;
  font-size: 14px;
}

.info-item span {
  color: #333333;
}

.action-buttons {
  display: flex;
  gap: 12px;
  align-items: center;
}

.btn-edit {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  background: #409EFF;
  color: white;
  transition: all 0.3s;
}

.btn-edit:hover {
  background: #66b1ff;
}

.btn-submit {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  background: #67C23A;
  color: white;
  transition: all 0.3s;
}

.btn-submit:hover {
  background: #85ce61;
}

.btn-submit:disabled {
  background: #a0c888;
  cursor: not-allowed;
}

.status-message {
  margin-bottom: 24px;
}

.status-alert {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px 20px;
  background: white; /* bg-white */
  border: 1px solid #fbbf24; /* border-yellow-400 */
  border-left: 4px solid #f59e0b; /* border-l-4 border-yellow-500 */
  border-radius: 8px; /* rounded-lg */
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1); /* shadow-sm */
}

.alert-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: #f59e0b; /* text-yellow-500 */
}

.alert-icon .el-icon {
  font-size: 20px;
}

.alert-content {
  flex: 1;
  min-width: 0;
}

.alert-title {
  font-size: 0.9375rem; /* text-sm */
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #1e293b; /* text-slate-800 */
}

.status-comment {
  margin: 8px 0;
  font-size: 0.875rem; /* text-sm */
  color: #64748b; /* text-slate-500 */
  line-height: 1.5;
}

.status-comment strong {
  color: #1e293b; /* text-slate-800 */
  font-weight: 600;
}

.status-hint {
  margin: 8px 0 0 0;
  font-size: 0.875rem; /* text-sm */
  color: #64748b; /* text-slate-500 */
  line-height: 1.5;
}

.title-section {
  margin-bottom: 8px;
}

.title-section h2 {
  margin: 0 0 4px 0;
  color: #303133;
  font-size: 28px;
  font-weight: 600;
}

.subtitle {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-icon {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.status-pending {
  background: rgba(33, 150, 243, 0.1);
  color: #2196F3;
}

.status-pending .status-icon {
  background: #2196F3;
}

.status-approved {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

.status-approved .status-icon {
  background: #4CAF50;
}

.status-need-update {
  background: rgba(244, 67, 54, 0.1);
  color: #F44336;
}

.status-need-update .status-icon {
  background: #F44336;
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  /* Компактные карточки на мобилке */
  .data-card {
    padding: 16px; /* Уменьшаем padding на мобилке */
  }
  
  .documents-card {
    padding: 12px 0; /* Только вертикальный padding, горизонтальный убираем */
  }
  
  .card-title {
    font-size: 1.125rem; /* text-lg */
    margin-bottom: 12px; /* Уменьшаем отступ снизу */
    padding: 0 12px; /* Добавляем padding только для заголовка */
  }
}
</style>