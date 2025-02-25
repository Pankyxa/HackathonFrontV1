<template>
  <div class="profile-data">
    <div class="header-actions">
      <div v-if="showStatusMessage" class="status-message">
        <el-alert
            type="warning"
            :closable="false"
            show-icon
        >
          <p>Требуется обновление данных</p>
          <p v-if="latestStatusComment" class="status-comment">
            Комментарий: {{ latestStatusComment }}
          </p>
        </el-alert>
      </div>
      <div class="header-content">
        <h2>Мои данные</h2>
        <div class="header-right">
          <span v-if="userData?.current_status" class="status-badge" :class="statusClass">
          <span class="status-icon"></span>
          {{ userData.current_status.description }}
        </span>
          <button
              v-if="canEdit"
              class="btn-edit"
              @click="showEditModal = true"
          >
            Редактировать
          </button>
        </div>
      </div>
    </div>

    <div class="info-section" v-if="userData">
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

    <UserDocuments
        v-if="userData && (hasMentorRole || hasParticipantRole)"
        :can-edit="canEdit"
        :user-data="userData"
        @update="handleDocumentsUpdate"
    />

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
import EditProfileDialog from './EditProfileDialog.vue'
import UserDocuments from './UserDocuments.vue'

const userData = ref(null)
const showEditModal = ref(false)

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

const handleUpdate = (updatedData) => {
  userData.value = updatedData
  showEditModal.value = false
  canEdit.value = false
  showStatusMessage.value = false
}

const handleDocumentsUpdate = (updatedData) => {
  userData.value = updatedData
  canEdit.value = false
  showStatusMessage.value = false
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
  max-width: 1000px;
  margin: 0 auto;
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

.info-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
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

.status-message {
  margin-bottom: 20px;
}

.status-comment {
  margin-top: 8px;
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
}
</style>