<template>
  <div class="stages-container">
    <div class="stages-content">
      <div class="header-actions">
      <h2 class="stages-title">Управление этапами</h2>
        <el-button type="primary" @click="showCreateDialog = true">
          <el-icon><Plus /></el-icon>
          Создать этап
        </el-button>
      </div>

      <el-alert
        v-if="error"
        :title="error"
        type="error"
        :closable="true"
        @close="error = null"
        style="margin-bottom: 20px;"
      />

      <div v-if="isLoading" class="loading">
        <el-skeleton :rows="5" animated/>
      </div>

      <div v-else class="stages-list">
        <div
            v-for="stage in stages"
            :key="stage.id"
            class="stage-item"
            :class="{ active: stage.is_active }"
        >
          <div class="stage-info">
            <h3>{{ stage.name }}</h3>
            <p>Тип: {{ stage.type }}</p>
            <p>Порядковый номер: {{ stage.order }}</p>
            <p v-if="stage.group">Группа: {{ getGroupName(stage.group) }}</p>
            <div style="margin-top: 8px; display: flex; gap: 8px; flex-wrap: wrap;">
              <el-tag v-if="stage.is_active" type="success">
                Активен
              </el-tag>
              <el-tag v-if="stage.is_auto_activate" type="warning">
                Автоматическая активация
              </el-tag>
              <el-tag v-if="stage.is_auto_activate && stage.auto_activate_at" type="info">
                {{ formatDateTime(stage.auto_activate_at) }}
              </el-tag>
            </div>
          </div>

          <div class="stage-actions">
            <el-button
                v-if="canActivateStage(stage)"
                type="success"
                size="default"
                @click="activateStage(stage.id)"
                :loading="activating"
            >
              Активировать
            </el-button>
            <el-button
                type="primary"
                size="default"
                @click="editStage(stage)"
            >
              Редактировать
            </el-button>
            <el-button
                v-if="!stage.is_active"
                type="danger"
                size="default"
                @click="deleteStage(stage.id)"
            >
              Удалить
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Диалог создания этапа -->
    <el-dialog
      v-model="showCreateDialog"
      title="Создать новый этап"
      width="550px"
    >
      <el-form :model="newStageForm" label-width="180px">
        <el-form-item label="Название" required>
          <el-input v-model="newStageForm.name" placeholder="Введите название этапа" />
        </el-form-item>
        <el-form-item label="Тип" required>
          <el-select v-model="newStageForm.type" placeholder="Выберите тип этапа" style="width: 100%">
            <el-option-group label="Регистрация">
              <el-option label="Регистрация" value="registration" />
              <el-option label="Регистрация закрыта" value="registration_closed" />
            </el-option-group>
            <el-option-group label="Заочный этап">
              <el-option label="Заочный этап - Распределение заданий" value="remote_task_distribution" />
              <el-option label="Заочный этап - Прием решений" value="remote_solution_submission" />
              <el-option label="Заочный этап - Проверка решений" value="remote_solution_review" />
              <el-option label="Заочный этап - Онлайн защита" value="online_defense" />
            </el-option-group>
            <el-option-group label="Финалисты">
              <el-option label="Определение финалистов" value="finalists_selection" />
            </el-option-group>
            <el-option-group label="Очный этап">
              <el-option label="Очный этап - Распределение заданий" value="on_site_task_distribution" />
              <el-option label="Очный этап - Прием решений" value="on_site_solution_submission" />
              <el-option label="Очный этап - Защита" value="on_site_defense" />
            </el-option-group>
            <el-option-group label="Завершение">
              <el-option label="Публикация результатов" value="results_publication" />
              <el-option label="Церемония награждения" value="award_ceremony" />
            </el-option-group>
            <el-option-group label="Устаревшие (для совместимости)">
              <el-option label="Распределение задач" value="task_distribution" />
              <el-option label="Подача решений" value="solution_submission" />
              <el-option label="Проверка решений" value="solution_review" />
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="Порядковый номер" required>
          <el-input-number v-model="newStageForm.order" :min="1" :max="100" />
        </el-form-item>
        <el-form-item label="Группировка">
          <el-select v-model="newStageForm.group" placeholder="Выберите группу" clearable style="width: 100%">
            <el-option label="Регистрация" value="registration" />
            <el-option label="Заочный этап" value="remote" />
            <el-option label="Очный этап" value="on_site" />
            <el-option label="Финалисты" value="final" />
            <el-option label="Завершение" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="Автоматическая активация">
          <el-switch v-model="newStageForm.is_auto_activate" />
        </el-form-item>
        <el-form-item 
          v-if="newStageForm.is_auto_activate" 
          label="Дата и время активации (МСК)" 
          required
        >
          <el-date-picker
            v-model="newStageForm.auto_activate_at"
            type="datetime"
            placeholder="Выберите дату и время"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DDTHH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateDialog = false">Отмена</el-button>
        <el-button type="primary" @click="handleCreateStage" :loading="isLoading">
          Создать
        </el-button>
      </template>
    </el-dialog>

    <!-- Диалог редактирования этапа -->
    <el-dialog
      v-model="showEditDialog"
      title="Редактировать этап"
      width="550px"
    >
      <el-form :model="editStageForm" label-width="180px">
        <el-form-item label="Название" required>
          <el-input v-model="editStageForm.name" placeholder="Введите название этапа" />
        </el-form-item>
        <el-form-item label="Тип" required>
          <el-select v-model="editStageForm.type" placeholder="Выберите тип этапа" style="width: 100%">
            <el-option-group label="Регистрация">
              <el-option label="Регистрация" value="registration" />
              <el-option label="Регистрация закрыта" value="registration_closed" />
            </el-option-group>
            <el-option-group label="Заочный этап">
              <el-option label="Заочный этап - Распределение заданий" value="remote_task_distribution" />
              <el-option label="Заочный этап - Прием решений" value="remote_solution_submission" />
              <el-option label="Заочный этап - Проверка решений" value="remote_solution_review" />
              <el-option label="Заочный этап - Онлайн защита" value="online_defense" />
            </el-option-group>
            <el-option-group label="Финалисты">
              <el-option label="Определение финалистов" value="finalists_selection" />
            </el-option-group>
            <el-option-group label="Очный этап">
              <el-option label="Очный этап - Распределение заданий" value="on_site_task_distribution" />
              <el-option label="Очный этап - Прием решений" value="on_site_solution_submission" />
              <el-option label="Очный этап - Защита" value="on_site_defense" />
            </el-option-group>
            <el-option-group label="Завершение">
              <el-option label="Публикация результатов" value="results_publication" />
              <el-option label="Церемония награждения" value="award_ceremony" />
            </el-option-group>
            <el-option-group label="Устаревшие (для совместимости)">
              <el-option label="Распределение задач" value="task_distribution" />
              <el-option label="Подача решений" value="solution_submission" />
              <el-option label="Проверка решений" value="solution_review" />
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="Порядковый номер" required>
          <el-input-number v-model="editStageForm.order" :min="1" :max="100" />
        </el-form-item>
        <el-form-item label="Группировка">
          <el-select v-model="editStageForm.group" placeholder="Выберите группу" clearable style="width: 100%">
            <el-option label="Регистрация" value="registration" />
            <el-option label="Заочный этап" value="remote" />
            <el-option label="Очный этап" value="on_site" />
            <el-option label="Финалисты" value="final" />
            <el-option label="Завершение" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="Автоматическая активация">
          <el-switch v-model="editStageForm.is_auto_activate" />
        </el-form-item>
        <el-form-item 
          v-if="editStageForm.is_auto_activate" 
          label="Дата и время активации (МСК)" 
          required
        >
          <el-date-picker
            v-model="editStageForm.auto_activate_at"
            type="datetime"
            placeholder="Выберите дату и время"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DDTHH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog = false">Отмена</el-button>
        <el-button type="primary" @click="handleUpdateStage" :loading="isLoading">
          Сохранить
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { stagesApi } from '@/api/stages'
import { useStageStore } from '@/stores/stage'
import { ElSkeleton, ElButton, ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const stages = ref([])
const isLoading = ref(false)
const error = ref(null)
const activating = ref(false)
const showCreateDialog = ref(false)
const showEditDialog = ref(false)

const newStageForm = ref({
  name: '',
  type: '',
  order: 1,
  group: null,
  is_auto_activate: false,
  auto_activate_at: null
})

const editStageForm = ref({
  id: null,
  name: '',
  type: '',
  order: 1,
  group: null,
  is_auto_activate: false,
  auto_activate_at: null
})

const stageStore = useStageStore()

const getGroupName = (group) => {
  const groupNames = {
    'registration': 'Регистрация',
    'remote': 'Заочный этап',
    'on_site': 'Очный этап',
    'final': 'Финалисты',
    'other': 'Завершение'
  }
  return groupNames[group] || group
}

const hasActiveStage = computed(() => {
  return stages.value.some(s => s.is_active)
})

function isAdjacentStage(stage) {
  const activeStage = stages.value.find(s => s.is_active)
  if (!activeStage) return true // Если нет активного этапа, можно активировать любой

  const activeOrder = activeStage.order

  // Разрешаем активацию только соседних этапов (разница в order = 1)
  return Math.abs(stage.order - activeOrder) === 1
}

function canActivateStage(stage) {
  // Нельзя активировать уже активный этап
  if (stage.is_active) return false
  
  // registration_closed можно активировать всегда
  if (stage.type === 'registration_closed') return true
  
  // Если нет активного этапа, можно активировать любой
  if (!hasActiveStage.value) return true
  
  // Иначе только соседний
  return isAdjacentStage(stage)
}

async function loadStages() {
  try {
    isLoading.value = true
    error.value = null
    stages.value = await stagesApi.getAllStages()
  } catch (err) {
    error.value = err.response?.data?.detail || err.message || 'Ошибка при загрузке этапов'
    console.error('Error loading stages:', err)
  } finally {
    isLoading.value = false
  }
}

async function activateStage(stageId) {
  try {
    activating.value = true
    await stagesApi.setStage(stageId)
    await loadStages()
    await stageStore.fetchCurrentStage()
    ElMessage.success('Этап успешно активирован')
  } catch (err) {
    error.value = err.response?.data?.detail || err.message || 'Ошибка при активации этапа'
    ElMessage.error(error.value)
    console.error('Error activating stage:', err)
  } finally {
    activating.value = false
  }
}

const handleCreateStage = async () => {
  if (!newStageForm.value.name || !newStageForm.value.type) {
    ElMessage.warning('Заполните все обязательные поля')
    return
  }

  if (newStageForm.value.is_auto_activate && !newStageForm.value.auto_activate_at) {
    ElMessage.warning('Укажите дату и время активации для автоматического этапа')
    return
  }

  try {
    isLoading.value = true
    // Формируем данные для отправки
    const stageData = {
      name: newStageForm.value.name,
      type: newStageForm.value.type,
      order: newStageForm.value.order,
      group: newStageForm.value.group || null,
      is_auto_activate: newStageForm.value.is_auto_activate,
      auto_activate_at: newStageForm.value.is_auto_activate && newStageForm.value.auto_activate_at 
        ? newStageForm.value.auto_activate_at + '+03:00' // Добавляем МСК timezone
        : null
    }
    await stagesApi.createStage(stageData)
    ElMessage.success('Этап успешно создан')
    showCreateDialog.value = false
    newStageForm.value = {
      name: '',
      type: '',
      order: 1,
      group: null,
      is_auto_activate: false,
      auto_activate_at: null
    }
    await loadStages()
  } catch (err) {
    const errorMsg = err.response?.data?.detail || err.message || 'Ошибка при создании этапа'
    ElMessage.error(errorMsg)
    error.value = errorMsg
  } finally {
    isLoading.value = false
  }
}

const editStage = (stage) => {
  // Конвертируем время из UTC в МСК для отображения
  let autoActivateAt = null
  if (stage.auto_activate_at) {
    const date = new Date(stage.auto_activate_at)
    // Конвертируем UTC в МСК (UTC+3)
    const mskOffset = 3 * 60 * 60 * 1000
    const mskTime = date.getTime() + mskOffset
    const mskDate = new Date(mskTime)
    
    // Форматируем в формат для el-date-picker (YYYY-MM-DDTHH:mm:ss)
    const year = mskDate.getUTCFullYear()
    const month = String(mskDate.getUTCMonth() + 1).padStart(2, '0')
    const day = String(mskDate.getUTCDate()).padStart(2, '0')
    const hours = String(mskDate.getUTCHours()).padStart(2, '0')
    const minutes = String(mskDate.getUTCMinutes()).padStart(2, '0')
    const seconds = String(mskDate.getUTCSeconds()).padStart(2, '0')
    autoActivateAt = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
  }
  
  editStageForm.value = {
    id: stage.id,
    name: stage.name,
    type: stage.type,
    order: stage.order,
    group: stage.group || null,
    is_auto_activate: stage.is_auto_activate || false,
    auto_activate_at: autoActivateAt
  }
  showEditDialog.value = true
}

const handleUpdateStage = async () => {
  if (!editStageForm.value.name || !editStageForm.value.type) {
    ElMessage.warning('Заполните все обязательные поля')
    return
  }

  if (editStageForm.value.is_auto_activate && !editStageForm.value.auto_activate_at) {
    ElMessage.warning('Укажите дату и время активации для автоматического этапа')
    return
  }

  try {
    isLoading.value = true
    // Формируем данные для отправки
    const stageData = {
      name: editStageForm.value.name,
      type: editStageForm.value.type,
      order: editStageForm.value.order,
      group: editStageForm.value.group || null,
      is_auto_activate: editStageForm.value.is_auto_activate,
      auto_activate_at: editStageForm.value.is_auto_activate && editStageForm.value.auto_activate_at
        ? editStageForm.value.auto_activate_at + '+03:00' // Добавляем МСК timezone
        : null
    }
    await stagesApi.updateStage(editStageForm.value.id, stageData)
    ElMessage.success('Этап успешно обновлен')
    showEditDialog.value = false
    await loadStages()
  } catch (err) {
    const errorMsg = err.response?.data?.detail || err.message || 'Ошибка при обновлении этапа'
    ElMessage.error(errorMsg)
    error.value = errorMsg
  } finally {
    isLoading.value = false
  }
}

const deleteStage = async (stageId) => {
  try {
    await ElMessageBox.confirm(
      'Вы уверены, что хотите удалить этот этап? Это действие нельзя отменить.',
      'Подтверждение удаления',
      {
        confirmButtonText: 'Удалить',
        cancelButtonText: 'Отмена',
        type: 'warning'
      }
    )
    isLoading.value = true
    await stagesApi.deleteStage(stageId)
    ElMessage.success('Этап успешно удален')
    await loadStages()
  } catch (err) {
    if (err !== 'cancel') {
      const errorMsg = err.response?.data?.detail || err.message || 'Ошибка при удалении этапа'
      ElMessage.error(errorMsg)
      error.value = errorMsg
    }
  } finally {
    isLoading.value = false
  }
}

function formatDateTime(dateTimeString) {
  if (!dateTimeString) return ''
  const date = new Date(dateTimeString)
  // Конвертируем UTC в МСК (UTC+3)
  const mskOffset = 3 * 60 * 60 * 1000 // МСК = UTC+3
  const mskTime = date.getTime() + mskOffset
  const mskDate = new Date(mskTime)
  
  const year = mskDate.getUTCFullYear()
  const month = String(mskDate.getUTCMonth() + 1).padStart(2, '0')
  const day = String(mskDate.getUTCDate()).padStart(2, '0')
  const hours = String(mskDate.getUTCHours()).padStart(2, '0')
  const minutes = String(mskDate.getUTCMinutes()).padStart(2, '0')
  return `${day}.${month}.${year} ${hours}:${minutes} МСК`
}

onMounted(loadStages)
</script>

<style scoped>
.stages-container {
  margin-top: 20px;
  flex: 1;
  display: flex;
  height: calc(100% - 42px);
  flex-direction: column;
  width: 100%;
}

.stages-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 20px;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.stages-title {
  margin: 0;
  color: #333333;
  font-size: 24px;
}

.stages-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stage-info {
  color: #333333;
}

.stage-info h3 {
  margin: 0;
  font-size: 18px;
  margin-bottom: 4px;
}

h3 {
  color: #333333;
}

.stage-info p {
  margin: 0;
  color: #666666;
}

.stage-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: white;
  transition: all 0.3s ease;
}

.stage-actions {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.stage-item.active {
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid #4CAF50;
}

.error {
  color: var(--el-color-danger);
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 4px;
  background: var(--el-color-danger-light-9);
}

.loading {
  padding: 20px;
}

@media (max-width: 768px) {
  .stages-container {
    height: auto;
    min-height: 100%;
  }

  .stages-content {
    padding: 0 10px;
  }

  .stage-item {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .stage-info {
    width: 100%;
  }
}
</style>