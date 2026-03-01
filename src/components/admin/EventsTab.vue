<template>
  <div class="events-container">
    <div class="header-actions">
      <el-button type="primary" @click="showCreateDialog = true">
        <el-icon><Plus /></el-icon>
        Создать событие
      </el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="events"
      style="width: 100%"
      stripe
    >
      <el-table-column prop="name" label="Название" width="250" />
      <el-table-column prop="description" label="Описание" show-overflow-tooltip />
      <el-table-column label="Статус" width="120">
        <template #default="scope">
          <el-tag :type="scope.row.is_active ? 'success' : 'info'">
            {{ scope.row.is_active ? 'Активно' : 'Неактивно' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="Создано" width="180">
        <template #default="scope">
          {{ formatDate(scope.row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column label="Действия" width="450" fixed="right">
        <template #default="scope">
          <div class="action-buttons">
            <el-button
              size="small"
              type="primary"
              @click="viewEvent(scope.row.id)"
            >
              Детали
            </el-button>
            <el-button
              v-if="!scope.row.is_active"
              size="small"
              type="success"
              @click="activateEvent(scope.row.id)"
            >
              Активировать
            </el-button>
            <el-button
              size="small"
              type="primary"
              plain
              @click="editEvent(scope.row)"
            >
              Редактировать
            </el-button>
            <el-button
              size="small"
              type="warning"
              @click="manageJudges(scope.row.id)"
            >
              Жюри
            </el-button>
            <el-button
              v-if="!scope.row.is_active"
              size="small"
              type="danger"
              @click="deleteEvent(scope.row.id)"
            >
              Удалить
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- Диалог создания события -->
    <el-dialog
      v-model="showCreateDialog"
      title="Создать новое событие"
      width="500px"
    >
      <el-form :model="newEventForm" label-width="140px">
        <el-form-item label="Название" required>
          <el-input v-model="newEventForm.name" placeholder="Введите название события" />
        </el-form-item>
        <el-form-item label="Описание">
          <el-input
            v-model="newEventForm.description"
            type="textarea"
            :rows="3"
            placeholder="Введите описание события"
          />
        </el-form-item>
        <el-form-item label="Скопировать этапы">
          <el-select
            v-model="newEventForm.copy_stages_from_event_id"
            placeholder="Выберите событие (опционально)"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="event in events"
              :key="event.id"
              :label="event.name"
              :value="event.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateDialog = false">Отмена</el-button>
        <el-button type="primary" @click="handleCreateEvent" :loading="loading">
          Создать
        </el-button>
      </template>
    </el-dialog>

    <!-- Диалог редактирования события -->
    <el-dialog
      v-model="showEditDialog"
      title="Редактировать событие"
      width="500px"
    >
      <el-form :model="editEventForm" label-width="120px">
        <el-form-item label="Название" required>
          <el-input v-model="editEventForm.name" placeholder="Введите название события" />
        </el-form-item>
        <el-form-item label="Описание">
          <el-input
            v-model="editEventForm.description"
            type="textarea"
            :rows="3"
            placeholder="Введите описание события"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog = false">Отмена</el-button>
        <el-button type="primary" @click="handleUpdateEvent" :loading="loading">
          Сохранить
        </el-button>
      </template>
    </el-dialog>

    <!-- Диалог деталей события -->
    <el-dialog
      v-model="showDetailDialog"
      title="Детали события"
      width="700px"
    >
      <div v-if="eventDetail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="Название">{{ eventDetail.name }}</el-descriptions-item>
          <el-descriptions-item label="Статус">
            <el-tag :type="eventDetail.is_active ? 'success' : 'info'">
              {{ eventDetail.is_active ? 'Активно' : 'Неактивно' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="Описание" :span="2">
            {{ eventDetail.description || 'Нет описания' }}
          </el-descriptions-item>
          <el-descriptions-item label="Создано">
            {{ formatDate(eventDetail.created_at) }}
          </el-descriptions-item>
          <el-descriptions-item label="Обновлено">
            {{ eventDetail.updated_at ? formatDate(eventDetail.updated_at) : 'Не обновлялось' }}
          </el-descriptions-item>
        </el-descriptions>

        <el-divider>Статистика</el-divider>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="Всего команд">
            {{ eventDetail.statistics?.total_teams || 0 }}
          </el-descriptions-item>
          <el-descriptions-item label="Активных команд">
            {{ eventDetail.statistics?.active_teams || 0 }}
          </el-descriptions-item>
          <el-descriptions-item label="Участников">
            {{ eventDetail.statistics?.total_participants || 0 }}
          </el-descriptions-item>
          <el-descriptions-item label="Менторов">
            {{ eventDetail.statistics?.total_mentors || 0 }}
          </el-descriptions-item>
          <el-descriptions-item label="Оценок">
            {{ eventDetail.statistics?.total_evaluations || 0 }}
          </el-descriptions-item>
          <el-descriptions-item label="Команд с решениями">
            {{ eventDetail.statistics?.teams_with_solutions || 0 }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <el-button @click="showDetailDialog = false">Закрыть</el-button>
      </template>
    </el-dialog>

    <!-- Диалог управления жюри -->
    <el-dialog
      v-model="showJudgesDialog"
      :title="`Управление жюри: ${currentEventName}`"
      width="800px"
    >
      <div class="judges-management">
        <div class="judges-section">
          <h3>Текущие жюри события</h3>
          <el-table
            v-loading="judgesLoading"
            :data="eventJudges"
            style="width: 100%"
            max-height="300px"
          >
            <el-table-column prop="full_name" label="ФИО" />
            <el-table-column prop="email" label="Email" />
            <el-table-column label="Действия" width="120" align="right">
              <template #default="scope">
                <el-button
                  size="small"
                  type="danger"
                  @click="removeJudge(scope.row.id)"
                  :loading="removingJudgeId === scope.row.id"
                >
                  Удалить
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <el-divider>Добавить жюри</el-divider>

        <div class="add-judge-section">
          <el-input
            v-model="judgeSearchQuery"
            placeholder="Поиск жюри по ФИО"
            clearable
            @input="handleJudgeSearch"
            style="margin-bottom: 20px"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>

          <el-table
            v-loading="judgeSearchLoading"
            :data="availableJudges"
            style="width: 100%"
            max-height="300px"
          >
            <el-table-column prop="full_name" label="ФИО" />
            <el-table-column prop="email" label="Email" />
            <el-table-column label="Действия" width="120" align="right">
              <template #default="scope">
                <el-button
                  size="small"
                  type="primary"
                  @click="addJudge(scope.row.id)"
                  :loading="addingJudgeId === scope.row.id"
                  :disabled="isJudgeAlreadyAdded(scope.row.id)"
                >
                  {{ isJudgeAlreadyAdded(scope.row.id) ? 'Добавлен' : 'Добавить' }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <template #footer>
        <el-button @click="showJudgesDialog = false">Закрыть</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'
import { eventsApi } from '@/api/events'
import { teamsApi } from '@/api/teams'

const loading = ref(false)
const events = ref([])
const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const showDetailDialog = ref(false)
const showJudgesDialog = ref(false)
const eventDetail = ref(null)
const currentEventId = ref(null)
const currentEventName = ref('')
const eventJudges = ref([])
const judgesLoading = ref(false)
const judgeSearchQuery = ref('')
const availableJudges = ref([])
const judgeSearchLoading = ref(false)
const addingJudgeId = ref(null)
const removingJudgeId = ref(null)

const newEventForm = ref({
  name: '',
  description: '',
  copy_stages_from_event_id: null
})

const editEventForm = ref({
  id: null,
  name: '',
  description: ''
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('ru-RU')
}

const loadEvents = async () => {
  try {
    loading.value = true
    events.value = await eventsApi.getEvents()
  } catch (error) {
    ElMessage.error(error.detail || error.message || 'Ошибка при загрузке событий')
  } finally {
    loading.value = false
  }
}

const handleCreateEvent = async () => {
  if (!newEventForm.value.name) {
    ElMessage.warning('Введите название события')
    return
  }

  try {
    loading.value = true
    await eventsApi.createEvent({
      name: newEventForm.value.name,
      description: newEventForm.value.description || null,
      copy_stages_from_event_id: newEventForm.value.copy_stages_from_event_id || null
    })
    ElMessage.success('Событие успешно создано')
    showCreateDialog.value = false
    newEventForm.value = {
      name: '',
      description: '',
      copy_stages_from_event_id: null
    }
    await loadEvents()
  } catch (error) {
    ElMessage.error(error.detail || error.message || 'Ошибка при создании события')
  } finally {
    loading.value = false
  }
}

const editEvent = (event) => {
  editEventForm.value = {
    id: event.id,
    name: event.name,
    description: event.description || ''
  }
  showEditDialog.value = true
}

const handleUpdateEvent = async () => {
  if (!editEventForm.value.name) {
    ElMessage.warning('Введите название события')
    return
  }

  try {
    loading.value = true
    await eventsApi.updateEvent(editEventForm.value.id, {
      name: editEventForm.value.name,
      description: editEventForm.value.description || null
    })
    ElMessage.success('Событие успешно обновлено')
    showEditDialog.value = false
    await loadEvents()
  } catch (error) {
    ElMessage.error(error.detail || error.message || 'Ошибка при обновлении события')
  } finally {
    loading.value = false
  }
}

const activateEvent = async (eventId) => {
  try {
    await ElMessageBox.confirm(
      'Вы уверены, что хотите активировать это событие? Все остальные события будут деактивированы.',
      'Подтверждение',
      {
        confirmButtonText: 'Активировать',
        cancelButtonText: 'Отмена',
        type: 'warning'
      }
    )
    loading.value = true
    await eventsApi.activateEvent(eventId)
    ElMessage.success('Событие успешно активировано')
    await loadEvents()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error.detail || error.message || 'Ошибка при активации события')
    }
  } finally {
    loading.value = false
  }
}

const deleteEvent = async (eventId) => {
  try {
    await ElMessageBox.confirm(
      'Вы уверены, что хотите удалить это событие? Это действие нельзя отменить.',
      'Подтверждение удаления',
      {
        confirmButtonText: 'Удалить',
        cancelButtonText: 'Отмена',
        type: 'warning'
      }
    )
    loading.value = true
    await eventsApi.deleteEvent(eventId)
    ElMessage.success('Событие успешно удалено')
    await loadEvents()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error.detail || error.message || 'Ошибка при удалении события')
    }
  } finally {
    loading.value = false
  }
}

const viewEvent = async (eventId) => {
  try {
    loading.value = true
    eventDetail.value = await eventsApi.getEventDetail(eventId)
    showDetailDialog.value = true
  } catch (error) {
    ElMessage.error(error.detail || error.message || 'Ошибка при загрузке деталей события')
  } finally {
    loading.value = false
  }
}

const manageJudges = async (eventId) => {
  currentEventId.value = eventId
  const event = events.value.find(e => e.id === eventId)
  currentEventName.value = event?.name || 'Событие'
  showJudgesDialog.value = true
  await loadEventJudges(eventId)
}

const loadEventJudges = async (eventId) => {
  try {
    judgesLoading.value = true
    const response = await eventsApi.getEventJudges(eventId)
    eventJudges.value = response.judges
  } catch (error) {
    ElMessage.error(error.detail || error.message || 'Ошибка при загрузке жюри')
  } finally {
    judgesLoading.value = false
  }
}

const handleJudgeSearch = async () => {
  if (judgeSearchQuery.value.length < 2 && judgeSearchQuery.value.length !== 0) {
    availableJudges.value = []
    return
  }

  try {
    judgeSearchLoading.value = true
    const response = await teamsApi.searchJudges(judgeSearchQuery.value)
    availableJudges.value = response
  } catch (error) {
    console.error('Error searching judges:', error)
    ElMessage.error('Ошибка при поиске жюри')
  } finally {
    judgeSearchLoading.value = false
  }
}

const isJudgeAlreadyAdded = (judgeId) => {
  return eventJudges.value.some(judge => judge.id === judgeId)
}

const addJudge = async (judgeId) => {
  if (!currentEventId.value) return

  try {
    addingJudgeId.value = judgeId
    await eventsApi.addJudgeToEvent(currentEventId.value, judgeId)
    ElMessage.success('Жюри успешно добавлен к событию')
    await loadEventJudges(currentEventId.value)
    // Обновляем список доступных жюри
    await handleJudgeSearch()
  } catch (error) {
    ElMessage.error(error.detail || error.message || 'Ошибка при добавлении жюри')
  } finally {
    addingJudgeId.value = null
  }
}

const removeJudge = async (judgeId) => {
  if (!currentEventId.value) return

  try {
    await ElMessageBox.confirm(
      'Вы уверены, что хотите удалить этого жюри из события?',
      'Подтверждение удаления',
      {
        confirmButtonText: 'Удалить',
        cancelButtonText: 'Отмена',
        type: 'warning'
      }
    )
    removingJudgeId.value = judgeId
    await eventsApi.removeJudgeFromEvent(currentEventId.value, judgeId)
    ElMessage.success('Жюри успешно удален из события')
    await loadEventJudges(currentEventId.value)
    // Обновляем список доступных жюри
    await handleJudgeSearch()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error.detail || error.message || 'Ошибка при удалении жюри')
    }
  } finally {
    removingJudgeId.value = null
  }
}

watch(showJudgesDialog, (newVal) => {
  if (!newVal) {
    // Очищаем данные при закрытии диалога
    currentEventId.value = null
    currentEventName.value = ''
    eventJudges.value = []
    judgeSearchQuery.value = ''
    availableJudges.value = []
  }
})

onMounted(() => {
  loadEvents()
})
</script>

<style scoped>
.events-container {
  margin-top: 20px;
  flex: 1;
  display: flex;
  height: calc(100% - 42px);
  flex-direction: column;
  width: 100%;
}

.header-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}

.judges-management {
  padding: 10px 0;
}

.judges-section h3 {
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: 500;
}

.add-judge-section {
  margin-top: 20px;
}
</style>
