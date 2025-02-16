<template>
  <div class="team-info">
    <div class="team-header">
      <div class="logo-container">
        <div class="logo-wrapper">
          <img
              v-if="teamLogo"
              :src="teamLogo"
              alt="Team Logo"
              class="team-logo"
          />
          <div v-else class="logo-placeholder">
            <span>Нет логотипа</span>
          </div>
        </div>
        <div class="logo-actions">
          <input
              type="file"
              ref="fileInput"
              @change="handleFileSelect"
              accept="image/*"
              style="display: none"
          >
          <button class="change-logo-btn" v-if="isTeamLeader" @click="$refs.fileInput.click()">
            Изменить логотип
          </button>
        </div>
      </div>
      <div class="team-details">
        <div class="info-group">
          <label>Название команды</label>
          <div class="info-value">{{ teamData.team_name }}</div>
        </div>
        <div class="info-group">
          <label>Девиз команды</label>
          <div class="info-value">{{ teamData.team_motto }}</div>
        </div>
        <button class="edit-btn" v-if="isTeamLeader" @click="openEditModal">
          Редактировать информацию
        </button>
      </div>
    </div>

    <div class="team-members-section">
      <div class="section-header">
        <h2 class="section-title">Участники команды</h2>
        <div class="header-right">
          <span class="member-count">{{ teamMembers.length }}/4 участников</span>
          <button
              v-if="isTeamLeader"
              class="add-member-btn"
              @click="showUserSearch"
              :disabled="teamMembers.length >= 5"
          >
            Добавить участника
          </button>
        </div>
      </div>
      <div class="members-list">
        <div v-for="member in teamMembers" :key="member.id" class="member-card">
          <div class="member-info">
            <div class="member-name">{{ member.user.full_name }}</div>
            <div class="member-role">{{ getRoleName(member.role) }}</div>
          </div>
          <div class="member-actions" v-if="isTeamLeader && member.user.id !== currentUserId">
            <button class="remove-btn" @click="confirmRemoveMember(member)">
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
        v-model="showEditModal"
        title="Редактирование информации"
        width="400px"
    >
      <div class="edit-form">
        <div class="form-group">
          <label>Название команды</label>
          <input type="text" v-model="editFormData.team_name" class="form-input"/>
        </div>
        <div class="form-group">
          <label>Девиз команды</label>
          <input type="text" v-model="editFormData.team_motto" class="form-input"/>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <button class="cancel-btn" @click="showEditModal = false">Отмена</button>
          <button
              class="save-btn"
              @click="saveTeamInfo"
              :disabled="loading"
          >
            {{ loading ? 'Сохранение...' : 'Сохранить' }}
          </button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
        v-model="showPhotoEditor"
        title="Редактирование фото"
        :width="isMobile ? '95%' : '700px'"
        class="editor-dialog"
        :close-on-click-modal="false"
    >
      <TeamPhotoEditor
          v-if="showPhotoEditor"
          v-model="logoFile"
          :initial-image="selectedImage"
          @update:modelValue="handleLogoChange"
          @cancel="showPhotoEditor = false"
      />
    </el-dialog>

    <el-dialog
        v-model="showConfirmDialog"
        title="Подтверждение удаления"
        width="400px"
    >
      <div class="confirm-content">
        <p>Вы действительно хотите удалить участника {{ selectedMember?.user.full_name }} из команды?</p>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <button class="cancel-btn" @click="showConfirmDialog = false">Отмена</button>
          <button
              class="confirm-btn"
              @click="removeMember"
              :disabled="removing"
          >
            {{ removing ? 'Удаление...' : 'Удалить' }}
          </button>
        </div>
      </template>
    </el-dialog>

    <UserSearchModal
        v-model="showAddMemberModal"
        :existing-members="teamMembers.map(member => member.user)"
        @select="handleMemberSelect"
    />
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import {teamsApi} from '@/api/teams'
import {useAuthStore} from '@/stores/auth'
import {ElMessage} from 'element-plus'
import TeamPhotoEditor from './TeamPhotoEditor.vue'
import UserSearchModal from './UserSearchModal.vue'

const emit = defineEmits(['update:teamInfo'])
const authStore = useAuthStore()
const currentUserId = computed(() => authStore.user?.id)

const fileInput = ref(null)
const showPhotoEditor = ref(false)
const selectedImage = ref(null)
const logoFile = ref(null)
const teamLogo = ref(null)

const teamData = ref({})
const teamMembers = ref([])
const loading = ref(false)
const removing = ref(false)
const showEditModal = ref(false)
const showConfirmDialog = ref(false)
const selectedMember = ref(null)
const editFormData = ref({
  team_name: '',
  team_motto: ''
})

const isTeamLeader = computed(() => teamData.value?.team_leader_id === currentUserId.value)
const isMobile = computed(() => window.innerWidth <= 768)

const showAddMemberModal = ref(false)

const validateFile = (file) => {
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    ElMessage({
      message: 'Размер файла не должен превышать 5MB',
      type: 'error'
    });
    return false;
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    ElMessage({
      message: 'Поддерживаются только изображения в форматах JPEG, PNG и GIF',
      type: 'error'
    });
    return false;
  }

  return true;
};

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      selectedImage.value = e.target.result
      showPhotoEditor.value = true
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }
}

const handleLogoChange = async (file) => {
  if (file && validateFile(file)) {
    try {
      loading.value = true;

      let fileToUpload = file;
      if (file instanceof Blob && !(file instanceof File)) {
        fileToUpload = new File([file], 'team-photo.png', {type: 'image/png'});
      }

      const teamId = teamData.value.id;
      if (!teamId) {
        throw new Error('Team ID not found');
      }

      await teamsApi.updateTeamLogo(teamId, fileToUpload);

      teamLogo.value = `${import.meta.env.VITE_API_URL}/teams/${teamId}/logo?t=${Date.now()}`;

      emit('update:teamInfo', {
        ...teamData.value,
        logo_updated_at: Date.now()
      });

      showPhotoEditor.value = false;

      ElMessage({
        message: 'Логотип команды успешно обновлен',
        type: 'success'
      });
    } catch (error) {
      console.error('Error uploading logo:', error);
      ElMessage({
        message: 'Ошибка при обновлении логотипа команды',
        type: 'error'
      });
    } finally {
      loading.value = false;
    }
  }
};

const getRoleName = (role) => {
  const upperRole = role.toUpperCase()
  const roles = {
    'TEAMLEAD': 'Лидер команды',
    'MEMBER': 'Участник команды'
  }
  return roles[upperRole] || role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
}

const loadTeamData = async () => {
  try {
    loading.value = true
    const team = await teamsApi.getMyTeam()
    if (team) {
      teamData.value = team
      if (team.logo_file_id) {
        teamLogo.value = `${import.meta.env.VITE_API_URL}/teams/${team.id}/logo`
      }
      emit('update:teamInfo', team)

      const membersData = await teamsApi.getTeamMembers(team.id)
      teamMembers.value = membersData.members
    }
  } catch (error) {
    console.error('Error loading team data:', error)
    ElMessage({
      message: 'Ошибка при загрузке данных команды',
      type: 'error'
    })
  } finally {
    loading.value = false
  }
}

const openEditModal = () => {
  console.log(currentUserId)
  editFormData.value = {
    team_name: teamData.value.team_name || '',
    team_motto: teamData.value.team_motto || ''
  }
  showEditModal.value = true
}

const saveTeamInfo = async () => {
  try {
    loading.value = true;

    if (!editFormData.value.team_name || !editFormData.value.team_motto) {
      ElMessage({
        message: 'Название и девиз команды обязательны для заполнения',
        type: 'warning'
      });
      return;
    }

    const updateData = {
      team_name: String(editFormData.value.team_name).trim(),
      team_motto: String(editFormData.value.team_motto).trim()
    };

    await teamsApi.updateTeamInfo(teamData.value.id, updateData);

    teamData.value = {
      ...teamData.value,
      ...updateData
    };

    emit('update:teamInfo', {
      ...teamData.value,
      updated_at: Date.now()
    });

    showEditModal.value = false;
    ElMessage({
      message: 'Информация о команде успешно обновлена',
      type: 'success'
    });
  } catch (error) {
    console.error('Error updating team info:', error);
    ElMessage({
      message: 'Ошибка при обновлении информации о команде',
      type: 'error'
    });
  } finally {
    loading.value = false;
  }
};

const confirmRemoveMember = (member) => {
  selectedMember.value = member
  showConfirmDialog.value = true
}

const removeMember = async () => {
  if (!selectedMember.value) return

  removing.value = true
  try {
    await teamsApi.removeTeamMember(teamData.value.id, selectedMember.value.id)
    teamMembers.value = teamMembers.value.filter(m => m.id !== selectedMember.value.id)
    showConfirmDialog.value = false
    ElMessage({
      message: 'Участник успешно удален из команды',
      type: 'success'
    })
  } catch (error) {
    console.error('Error removing team member:', error)
    ElMessage({
      message: 'Ошибка при удалении участника',
      type: 'error'
    })
  } finally {
    removing.value = false
  }
}

onMounted(() => {
  loadTeamData()
})

const handleMemberSelect = async (user) => {
  try {
    loading.value = true;
    await teamsApi.addTeamMember(teamData.value.id, {
      user_id: user.id,
      role: 'member'
    });

    // Обновляем список участников
    const membersData = await teamsApi.getTeamMembers(teamData.value.id);
    teamMembers.value = membersData.members;

    showAddMemberModal.value = false;

    ElMessage({
      message: 'Приглашение в команду успешно отправлено',
      type: 'success'
    });
  } catch (error) {
    console.error('Error adding team member:', error);
    ElMessage({
      message: error.message || 'Ошибка при добавлении участника',
      type: 'error'
    });
  } finally {
    loading.value = false;
  }
};

const showUserSearch = () => {
  if (teamMembers.value.length >= 4) {
    ElMessage({
      message: 'Достигнуто максимальное количество участников (4)',
      type: 'warning'
    });
    return;
  }
  showAddMemberModal.value = true;
};
</script>

<style scoped>
.team-info {
  max-width: 800px;
}

.team-header {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.logo-container {
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-wrapper {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
}

.team-logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.logo-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-background-soft);
  color: var(--color-text-light);
  border: 2px dashed var(--color-border);
}

.logo-actions {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  width: 100%;
}

.change-logo-btn {
  padding: 8px 16px;
  background: #FFFFFF;
  color: #5B51D8;
  border: 2px solid #5B51D8;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 15px;
  font-weight: 500;
  min-width: 120px;
  text-align: center;
}

.change-logo-btn:hover {
  background: rgba(91, 81, 216, 0.1);
}

.change-logo-btn:active {
  transform: translateY(1px);
}

.team-details {
  flex: 1;
}

.info-group {
  margin-bottom: 1.5rem;
}

.info-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
  font-size: 0.9rem;
}

.info-value {
  font-size: 1.1rem;
  color: #333;
  padding: 0.5rem 0;
}

.edit-btn {
  margin-top: 1rem;
  padding: 8px 20px;
  background: white;
  color: #5B51D8;
  border: 2px solid #5B51D8;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.edit-btn:hover {
  background: rgba(91, 81, 216, 0.1);
}

.edit-btn:active {
  transform: translateY(1px);
}

.team-members-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #dcdfe6;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.add-member-btn {
  padding: 8px 20px;
  background: white;
  color: #5B51D8;
  border: 2px solid #5B51D8;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.add-member-btn:hover {
  background: rgba(91, 81, 216, 0.1);
}

.add-member-btn:active {
  transform: translateY(1px);
}

.add-member-form {
  padding: 1rem;
}

.section-title {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.members-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.member-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.member-card:hover {
  border-color: #5B51D8;
  box-shadow: 0 2px 8px rgba(91, 81, 216, 0.1);
}

.member-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.member-name {
  font-size: 1.1rem;
  color: #333;
  font-weight: 500;
}

.member-role {
  font-size: 0.9rem;
  color: #666;
}

.member-actions {
  display: flex;
  gap: 0.5rem;
}

.remove-btn {
  padding: 6px 16px;
  background: white;
  color: #f56c6c;
  border: 1px solid #f56c6c;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.remove-btn:hover {
  background: #fef0f0;
}

.edit-form {
  padding: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  color: #333;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
}

.cancel-btn,
.save-btn {
  padding: 8px 20px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: white;
  color: #606266;
  border: 1px solid #dcdfe6;
}

.cancel-btn:hover {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}

.save-btn {
  background: linear-gradient(90deg, #00A3FF 0%, #5B51D8 100%);
  color: white;
  border: none;
}

.save-btn:hover {
  opacity: 0.9;
}

.save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.confirm-btn {
  padding: 8px 20px;
  background: #f56c6c;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.confirm-btn:hover {
  opacity: 0.9;
}

.confirm-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.editor-dialog :deep(.el-dialog__body) {
  padding: 0;
}

@media (max-width: 768px) {
  .team-header {
    flex-direction: column;
    align-items: center;
  }

  .team-details {
    width: 100%;
  }
}
</style>