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

      <div class="roles-section">
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

      <DocumentsSection
          :loading="documentsLoading"
          :documents="documents"
      />

      <div class="actions-section">
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

const props = defineProps({
  visible: Boolean,
  user: Object,
  loading: Boolean,
  documents: Array,
  documentsLoading: Boolean
})

const emit = defineEmits(['update:visible', 'roles-updated'])

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const isMobile = computed(() => window.innerWidth <= 768)

const selectedRoles = ref([])
const savingRoles = ref(false)

const availableRoles = [
  { name: 'admin', description: 'Администратор' },
  { name: 'organizer', description: 'Организатор' },
  { name: 'mentor', description: 'Наставник' },
  { name: 'participant', description: 'Участник' },
  { name: 'judge', description: 'Жюри' },
]

watch(() => props.user, (newUser) => {
  if (newUser && newUser.roles) {
    selectedRoles.value = newUser.roles.map(role => role.name)
  } else {
    selectedRoles.value = []
  }
}, { immediate: true })

const isRoleSelected = (roleName) => {
  return selectedRoles.value.includes(roleName)
}

const handleRolesChange = (value) => {
  selectedRoles.value = value
}

const saveRoles = async () => {
  if (!props.user) return

  try {
    savingRoles.value = true
    await usersApi.updateUserRoles(props.user.id, selectedRoles.value)
    ElMessage.success('Роли пользователя успешно обновлены')
    emit('roles-updated')
  } catch (error) {
    ElMessage.error('Ошибка при обновлении ролей пользователя')
    console.error('Error updating user roles:', error)
  } finally {
    savingRoles.value = false
    dialogVisible.value = false
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