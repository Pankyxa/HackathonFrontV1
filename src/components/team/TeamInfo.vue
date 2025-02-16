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
          <button class="change-logo-btn" @click="$refs.fileInput.click()">
            Изменить логотип
          </button>
        </div>
      </div>
      <div class="team-details">
        <div class="form-group">
          <label>Название команды</label>
          <input type="text" v-model="teamData.team_name" class="form-input"/>
        </div>
        <div class="form-group">
          <label>Девиз команды</label>
          <input type="text" v-model="teamData.team_motto" class="form-input"/>
        </div>
      </div>
    </div>
    <div class="team-description">
      <div class="form-group">
        <label>Описание команды</label>
        <textarea
            v-model="teamData.description"
            class="form-input"
            rows="4"
        ></textarea>
      </div>
    </div>
    <div class="actions">
      <button class="save-btn" @click="saveTeamInfo" :disabled="loading">
        {{ loading ? 'Сохранение...' : 'Сохранить изменения' }}
      </button>
    </div>

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
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import {teamsApi} from '@/api/teams'
import TeamPhotoEditor from './TeamPhotoEditor.vue'
import {ElMessage} from 'element-plus'

const emit = defineEmits(['update:teamInfo'])
const fileInput = ref(null)
const showPhotoEditor = ref(false)
const selectedImage = ref(null)
const logoFile = ref(null)
const teamLogo = ref(null)
const loading = ref(false)

const teamData = ref({
  team_motto: '',
  description: ''
})

const isMobile = computed(() => window.innerWidth <= 768)

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
        fileToUpload = new File([file], 'team-photo.png', { type: 'image/png' });
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

const saveTeamInfo = async () => {
  loading.value = true
  try {
    //todo: Реализовать сохранение данных команды/заменить на поля и сделать модалку?
  } catch (error) {
    console.error('Error saving team info:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    loading.value = true
    const teamInfo = await teamsApi.getCurrentTeam()
    if (teamInfo) {
      teamData.value = teamInfo
      if (teamInfo.logo_file_id) {
        teamLogo.value = `${import.meta.env.VITE_API_URL}/teams/${teamInfo.id}/logo`
      }
      emit('update:teamInfo', teamInfo)
    }
  } catch (error) {
    console.error('Error loading team info:', error)
  } finally {
    loading.value = false
  }
})
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

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--color-text);
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-text);
}

textarea.form-input {
  resize: vertical;
  min-height: 100px;
}

.save-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(90deg, #00A3FF 0%, #5B51D8 100%);
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.save-btn:hover {
  opacity: 0.9;
}

.save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.actions {
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
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

.editor-dialog :deep(.el-dialog__body) {
  padding: 0;
}
</style>