<template>
  <div class="solution-section">
    <div v-loading="loading" class="solution-container">
      <!-- Notice -->
      <div v-if="authStore.isMember" class="important-notice">
        <h4>Важно!</h4>
        <p class="warning-text">Решения, загруженные после дедлайна, не будут приняты к оценке!</p>
      </div>

      <CountdownTimer v-if="authStore.isMember" inline />

      <!-- GitHub Link Card -->
      <div class="solution-card">
        <h3 class="card-title">{{ isOnSiteSolution ? 'Ссылка на решение очного этапа' : 'Ссылка на решение' }}</h3>
        
        <div class="solution-content">
          <p class="solution-description">
            Укажите ссылку на ваш GitHub репозиторий с решением
            {{ isOnSiteSolution ? ' очного этапа' : '' }}.
            Убедитесь, что репозиторий приватный и вы добавили организаторов в collaborators.
            <span v-if="isOnSiteSolution"> Это отдельная ссылка: решение заочного этапа не будет перезаписано.</span>
          </p>

          <!-- Input field -->
          <div v-if="canEdit" class="input-block">
            <el-input
              v-model="solutionLink"
              placeholder="https://github.com/username/repo"
              class="solution-link-input"
            >
              <template #append>
                <el-button
                  type="primary"
                  @click="saveSolutionLink"
                  :disabled="!solutionLink.trim()"
                >
                  Сохранить
                </el-button>
              </template>
            </el-input>
          </div>

          <!-- Display saved link -->
          <div v-else-if="solutionLink" class="saved-link-block">
            <div class="saved-label">Сохраненная ссылка:</div>
            <el-link
              type="primary"
              :href="solutionLink"
              target="_blank"
              class="solution-link"
            >
              <el-icon><Link /></el-icon>
              {{ solutionLink }}
            </el-link>
          </div>

          <div v-else class="no-link-message">
            Ссылка на решение еще не добавлена
          </div>
        </div>
      </div>

      <!-- Instructions Card -->
      <div class="instructions-card">
        <h3 class="card-title">Инструкция по отправке решения</h3>
        
        <div class="download-attachment-card">
          <el-icon class="file-icon"><Document /></el-icon>
          <div class="file-info">
            <div class="file-name">Инструкция_по_отправке_решения.html</div>
            <div class="file-type">HTML страница</div>
          </div>
          <a href="/files/Инструкция_по_отправке_решения.html" target="_blank" class="download-action">
            Открыть
          </a>
        </div>

        <div class="instructions-content">
          <h4>Требования к решению:</h4>
          <ul>
            <li>Решение должно быть размещено в приватном GitHub репозитории</li>
            <li>В репозитории должен быть README.md с описанием проекта</li>
            <li>Код должен быть документирован</li>
            <li>Должна быть инструкция по запуску</li>
            <li>Все зависимости должны быть указаны в requirements.txt или аналоге</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Link, Document } from '@element-plus/icons-vue'
import { teamsApi } from '@/api/teams'
import { useAuthStore } from "@/stores/auth.js"
import { useStageStore } from "@/stores/stage.js";
import CountdownTimer from '@/components/CountdownTimer.vue'

const authStore = useAuthStore()
const stageStore = useStageStore()

const props = defineProps({
  teamId: {
    type: String,
    required: true
  },
  isFinalist: {
    type: Boolean,
    default: false
  }
})

const loading = ref(false)
const solutionLink = ref('')

const isOnSiteSolution = computed(() => stageStore.isOnSiteContentPhase && props.isFinalist)

const extractErrorMessage = (error) => {
  if (!error) {
    return 'Ошибка при сохранении ссылки'
  }

  if (typeof error === 'string') {
    return error
  }

  if (error.detail) {
    if (typeof error.detail === 'string') {
      return error.detail
    }

    if (Array.isArray(error.detail)) {
      return error.detail
        .map((item) => item?.msg || item?.message)
        .filter(Boolean)
        .join(', ')
    }
  }

  if (error.message) {
    return error.message
  }

  return 'Ошибка при сохранении ссылки'
}

// Расширенная проверка - включает новые типы этапов
const canEdit = computed(() => {
  if (!authStore.isMember) return false
  
  const stageType = stageStore.currentStage?.type
  if (!stageType) return false

  const remoteStages = [
    'task_distribution',
    'solution_submission',
    'remote_task_distribution',
    'remote_solution_submission',
  ]
  const onSiteStages = [
    'on_site_task_distribution',
    'on_site_solution_submission'
  ]

  if (onSiteStages.includes(stageType)) {
    return props.isFinalist
  }
  
  return remoteStages.includes(stageType)
})

const loadData = async () => {
  try {
    loading.value = true
    const team = await teamsApi.getTeam(props.teamId)
    solutionLink.value = isOnSiteSolution.value
      ? (team.on_site_solution_link || '')
      : (team.solution_link || '')
  } catch (error) {
    console.error('Error loading team data:', error)
    ElMessage.error('Ошибка при загрузке данных')
  } finally {
    loading.value = false
  }
}

const saveSolutionLink = async () => {
  const trimmedLink = solutionLink.value.trim()
  if (!trimmedLink) return
  
  try {
    loading.value = true
    const response = await teamsApi.updateSolutionLink(props.teamId, trimmedLink)
    solutionLink.value = isOnSiteSolution.value
      ? (response.on_site_solution_link || response.solution_link || trimmedLink)
      : (response.solution_link || trimmedLink)
    ElMessage.success('Ссылка на решение успешно сохранена')
  } catch (error) {
    console.error('Error saving solution link:', error)
    ElMessage.error(extractErrorMessage(error))
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.solution-section {
  width: 100%;
}

.solution-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Cards */
.solution-card,
.instructions-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  padding: 24px;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 20px 0;
}

/* Notice */
.important-notice {
  background: #fff3f3;
  border: 1px solid #ffa4a4;
  border-radius: 8px;
  padding: 16px;
}

.important-notice h4 {
  color: #f56c6c;
  margin: 0 0 8px 0;
}

.warning-text {
  color: #f56c6c;
  font-weight: 500;
  margin: 0;
}

/* Solution Content */
.solution-description {
  color: #64748b;
  margin-bottom: 20px;
  line-height: 1.6;
}

.input-block {
  margin-top: 16px;
}

.solution-link-input {
  width: 100%;
}

.saved-link-block {
  margin-top: 16px;
  padding: 16px;
  background: #f1f5f9;
  border-radius: 8px;
}

.saved-label {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 8px;
}

.solution-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  word-break: break-all;
}

.no-link-message {
  margin-top: 16px;
  padding: 16px;
  background: #f1f5f9;
  border-radius: 8px;
  color: #64748b;
  text-align: center;
}

/* Instructions Card */
.download-attachment-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #f1f5f9;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  transition: background-color 0.2s ease;
}

.download-attachment-card:hover {
  background: #e2e8f0;
}

.file-icon {
  font-size: 32px;
  color: #64748b;
  flex-shrink: 0;
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 4px;
  word-break: break-all;
}

.file-type {
  font-size: 0.75rem;
  color: #64748b;
}

.download-action {
  padding: 8px 16px;
  background: white;
  color: #2563eb;
  border: 1px solid #2563eb;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  white-space: nowrap;
  text-decoration: none;
  display: inline-block;
}

.download-action:hover {
  background: #eff6ff;
}

/* Instructions Content */
.instructions-content {
  color: #334155;
}

.instructions-content h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.instructions-content ul {
  padding-left: 1.5rem;
  margin: 0;
}

.instructions-content li {
  margin-bottom: 8px;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .solution-card,
  .instructions-card {
    padding: 16px;
  }
  
  .download-attachment-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .download-action {
    width: 100%;
    text-align: center;
  }
}
</style>
