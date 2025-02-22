<template>
  <el-dialog
      v-model="dialogVisible"
      title="Редактирование команды"
      :width="isMobile ? '95%' : '500px'"
      :close-on-click-modal="false"
  >
    <div class="edit-team-form">
      <div class="form-group">
        <label>Название команды</label>
        <input type="text" v-model="formData.team_name" class="form-input"/>
      </div>
      <div class="form-group">
        <label>Девиз команды</label>
        <input type="text" v-model="formData.team_motto" class="form-input"/>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <button class="cancel-btn" @click="handleCancel">Отмена</button>
        <button class="save-btn" @click="handleSave" :disabled="loading">
          {{ loading ? 'Сохранение...' : 'Сохранить' }}
        </button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import {ref, computed} from 'vue'
import {ElMessage} from 'element-plus'
import {teamsApi} from '@/api/teams'

const props = defineProps({
  modelValue: Boolean,
  teamData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'saved'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const formData = ref({...props.teamData})
const loading = ref(false)
const isMobile = computed(() => window.innerWidth <= 768)

const handleCancel = () => {
  dialogVisible.value = false
  formData.value = {...props.teamData}
}

const handleSave = async () => {
  loading.value = true
  try {
    const updatedTeam = await teamsApi.updateTeam(formData.value.id, {
      team_name: formData.value.team_name,
      team_motto: formData.value.team_motto,
    })
    emit('saved', updatedTeam)
    dialogVisible.value = false
    ElMessage({
      message: 'Информация о команде успешно обновлена',
      type: 'success'
    })
  } catch (error) {
    console.error('Error saving team info:', error)
    ElMessage({
      message: 'Ошибка при сохранении информации о команде',
      type: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.edit-team-form {
  padding: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
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
  background: white;
  color: #333;
}

textarea.form-input {
  resize: vertical;
  min-height: 100px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem;
}

.cancel-btn {
  padding: 8px 20px;
  background: white;
  color: #606266;
  border: 1px solid #dcdfe6;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}

.save-btn {
  padding: 8px 20px;
  background: linear-gradient(90deg, #00A3FF 0%, #5B51D8 100%);
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-btn:hover {
  opacity: 0.9;
}

.save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>