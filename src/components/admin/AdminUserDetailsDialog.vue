<template>
  <el-dialog
      v-model="dialogVisible"
      title="Информация о пользователе"
      class="user-details-dialog"
      :width="isMobile ? '100%' : '80%'"
      :fullscreen="isMobile"
  >
    <div v-loading="loading" class="user-details-content">
      <UserInfo :user="user" />

      <div class="roles-section" v-if="authStore.isAdmin">
        <h3>Управление ролями</h3>
        <div class="roles-container">
          <el-checkbox-group v-model="selectedRoles" @change="handleRolesChange">
            <el-checkbox
              v-for="role in availableRoles"
              :key="role.name"
              :label="role.name"
              :checked="isRoleSelected(role.name)"
            >
              {{ role.description }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>

      <div class="judge-event-section" v-if="authStore.isAdmin && isJudge && activeEvent">
        <h3>Привязка к событию</h3>
        <div class="event-info">
          <p class="event-name">
            <strong>Активное событие:</strong> {{ activeEvent.name }}
          </p>
          <el-switch
            v-model="isJudgeAttachedToEvent"
            active-text="Привязан к событию"
            inactive-text="Не привязан к событию"
            @change="handleJudgeEventAttachment"
          />
        </div>
      </div>

      <DocumentsSection
          :loading="documentsLoading"
          :documents="documents"
      />

      <div class="documents-upload-section" v-if="authStore.isAdmin && user">
        <h3>Прикрепить документы</h3>
        <p class="documents-upload-hint">PDF, до 5MB. Можно заменить уже загруженный файл.</p>
        <div class="documents-upload-actions">
          <el-upload
              action="#"
              :auto-upload="false"
              :show-file-list="false"
              accept="application/pdf"
              :on-change="(file) => uploadDocument(file, 'consent')"
          >
            <el-button :loading="uploadingType === 'consent'">Загрузить согласие</el-button>
          </el-upload>
          <el-upload
              action="#"
              :auto-upload="false"
              :show-file-list="false"
              accept="application/pdf"
              :on-change="(file) => uploadDocument(file, 'certificate')"
          >
            <el-button :loading="uploadingType === 'certificate'">Загрузить справку</el-button>
          </el-upload>
        </div>
      </div>

      <div class="actions-section" v-if="authStore.isAdmin">
        <el-button
            type="primary"
            @click="saveRoles"
            :loading="savingRoles"
        >
          Сохранить изменения
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import UserInfo from '../organizer/UserInfo.vue'
import DocumentsSection from '../organizer/DocumentsSection.vue'
import { usersApi } from '@/api/users'
import { eventsApi } from '@/api/events'

import { useAuthStore } from "@/stores/auth.js"

const authStore = useAuthStore()

const props = defineProps({
  visible: Boolean,
  user: Object,
  loading: Boolean,
  documents: Array,
  documentsLoading: Boolean
})

const emit = defineEmits(['update:visible', 'roles-updated', 'documents-updated'])

const uploadingType = ref(null)

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const isMobile = computed(() => window.innerWidth <= 768)

const selectedRoles = ref([])
const savingRoles = ref(false)
const activeEvent = ref(null)
const isJudgeAttachedToEvent = ref(false)

const availableRoles = [
  { name: 'admin', description: 'Администратор' },
  { name: 'organizer', description: 'Организатор' },
  { name: 'mentor', description: 'Наставник' },
  { name: 'participant', description: 'Участник' },
  { name: 'judge', description: 'Жюри' },
]

watch(() => props.user, async (newUser) => {
  if (newUser && newUser.roles) {
    selectedRoles.value = newUser.roles.map(role => role.name)
  } else {
    selectedRoles.value = []
  }
  // Загружаем информацию о привязке к событию, если пользователь - жюри
  if (newUser && selectedRoles.value.includes('judge')) {
    if (!activeEvent.value) {
      await loadActiveEvent()
    }
    if (activeEvent.value) {
      await checkJudgeEventAttachment()
    }
  } else {
    isJudgeAttachedToEvent.value = false
  }
}, { immediate: true })

// Отслеживаем изменения selectedRoles для загрузки информации о событии (только для отображения)
watch(selectedRoles, async (newRoles) => {
  if (newRoles.includes('judge') && props.user) {
    if (!activeEvent.value) {
      await loadActiveEvent()
    }
    if (activeEvent.value) {
      await checkJudgeEventAttachment()
    }
  }
}, { immediate: false })

watch(() => props.visible, (newVal) => {
  if (newVal && !activeEvent.value) {
    loadActiveEvent()
  }
}, { immediate: true })

const isRoleSelected = (roleName) => {
  return selectedRoles.value.includes(roleName)
}

const isJudge = computed(() => {
  // Проверяем выбранные роли (включая те, что еще не сохранены)
  return selectedRoles.value.includes('judge')
})

const handleRolesChange = (value) => {
  selectedRoles.value = value
}

const saveRoles = async () => {
  if (!props.user) return

  try {
    savingRoles.value = true
    
    // Сохраняем роли
    await usersApi.updateUserRoles(props.user.id, selectedRoles.value)
    
    // Если пользователь имеет роль жюри, обрабатываем привязку к событию
    if (selectedRoles.value.includes('judge') && activeEvent.value) {
      const shouldBeAttached = isJudgeAttachedToEvent.value
      const currentJudges = await eventsApi.getEventJudges(activeEvent.value.id)
      const isCurrentlyAttached = currentJudges.judges.some(j => j.id === props.user.id)
      
      // Привязываем или отвязываем только если состояние изменилось
      if (shouldBeAttached && !isCurrentlyAttached) {
        await eventsApi.addJudgeToEvent(activeEvent.value.id, props.user.id)
      } else if (!shouldBeAttached && isCurrentlyAttached) {
        await eventsApi.removeJudgeFromEvent(activeEvent.value.id, props.user.id)
      }
    } else if (!selectedRoles.value.includes('judge') && activeEvent.value) {
      // Если роль жюри была снята, отвязываем от события
      const currentJudges = await eventsApi.getEventJudges(activeEvent.value.id)
      const isCurrentlyAttached = currentJudges.judges.some(j => j.id === props.user.id)
      if (isCurrentlyAttached) {
        await eventsApi.removeJudgeFromEvent(activeEvent.value.id, props.user.id)
      }
    }
    
    ElMessage.success('Изменения успешно сохранены')
    emit('roles-updated')
  } catch (error) {
    ElMessage.error(error.detail || error.message || 'Ошибка при сохранении изменений')
    console.error('Error saving changes:', error)
  } finally {
    savingRoles.value = false
    dialogVisible.value = false
  }
}

const loadActiveEvent = async () => {
  try {
    activeEvent.value = await eventsApi.getActiveEvent()
    if (isJudge.value && props.user) {
      await checkJudgeEventAttachment()
    }
  } catch (error) {
    console.error('Error loading active event:', error)
    activeEvent.value = null
  }
}

const checkJudgeEventAttachment = async () => {
  if (!activeEvent.value || !props.user) return
  
  try {
    const response = await eventsApi.getEventJudges(activeEvent.value.id)
    const judgeIds = response.judges.map(j => j.id)
    isJudgeAttachedToEvent.value = judgeIds.includes(props.user.id)
  } catch (error) {
    console.error('Error checking judge attachment:', error)
    isJudgeAttachedToEvent.value = false
  }
}

const handleJudgeEventAttachment = (attached) => {
  // Просто обновляем локальное состояние, сохранение произойдет при нажатии "Сохранить изменения"
  isJudgeAttachedToEvent.value = attached
}

const uploadDocument = async (uploadFile, documentType) => {
  const file = uploadFile?.raw
  if (!file || !props.user) return

  if (file.type && file.type !== 'application/pdf') {
    ElMessage.error('Допустимый формат: PDF')
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.error('Размер файла не должен превышать 5MB')
    return
  }

  uploadingType.value = documentType
  try {
    await usersApi.adminUploadUserDocument(props.user.id, file, documentType)
    ElMessage.success(documentType === 'consent' ? 'Согласие загружено' : 'Справка загружена')
    emit('documents-updated')
  } catch (error) {
    ElMessage.error(error?.detail || error?.message || 'Не удалось загрузить документ')
  } finally {
    uploadingType.value = null
  }
}

const addDialogStyles = () => {
  const style = document.createElement('style')
  style.id = 'user-details-dialog-styles'
  style.innerHTML = `
    .user-details-dialog .el-dialog {
      width: 80vh !important;
    }
    .user-details-dialog .el-dialog__body {
      padding: 20px;
      height: 70vh;
      overflow: hidden;
    }
    @media (max-width: 768px) {
      .user-details-dialog .el-dialog__body {
        height: calc(100vh - 66px) !important;
        padding: 16px;
      }
    }
  `
  document.head.appendChild(style)
}

const removeDialogStyles = () => {
  const style = document.getElementById('user-details-dialog-styles')
  if (style) {
    style.remove()
  }
}

onMounted(() => {
  addDialogStyles()
})

onUnmounted(() => {
  removeDialogStyles()
})
</script>

<style scoped>
.user-details-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 100%;
  overflow-y: auto;
  padding-right: 10px;
}

.user-details-content::-webkit-scrollbar {
  width: 8px;
}

.user-details-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.user-details-content::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.user-details-content::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.roles-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.roles-container {
  margin-top: 16px;
}

.roles-container .el-checkbox {
  margin-right: 24px;
  margin-bottom: 12px;
}

.documents-upload-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.documents-upload-section h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 500;
}

.documents-upload-hint {
  margin: 0 0 16px 0;
  font-size: 13px;
  color: #64748b;
}

.documents-upload-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.judge-event-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.judge-event-section h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 500;
}

.event-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.event-name {
  margin: 0;
  font-size: 14px;
  color: #606266;
}

.event-name strong {
  color: #303133;
}

.actions-section {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .actions-section {
    flex-direction: column;
  }

  .actions-section .el-button {
    width: 100%;
    margin: 0 0 0 10px;
  }
}
</style>