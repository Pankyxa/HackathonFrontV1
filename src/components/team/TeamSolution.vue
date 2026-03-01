<template>
  <div class="solution-section">
    <div v-loading="loading" class="solution-container">
      <div v-if="authStore.isMember" class="important-notice">
        <h4>Важно!</h4>
        <p class="warning-text">Решения, загруженные после дедлайна, не будут приняты к оценке!</p>
      </div>

      <div class="solution-card">
        <h3 class="card-title">Решение команды</h3>
        <div class="solution-block">
        <!-- ЗАКОММЕНТИРОВАНО: Загрузка файлов решений отключена, решения теперь через GitHub -->
        <!-- <div v-if="authStore.isMember" class="solution-type-selector">
          <h4>Способ предоставления решения</h4>
          <el-radio-group v-model="solutionType" class="solution-type-group">
            <el-radio label="file">Загрузить ZIP архив</el-radio>
            <el-radio label="link">Указать ссылку на репозиторий</el-radio>
          </el-radio-group>
        </div> -->
        <div v-if="authStore.isMentor" class="solution-type-selector">
          <h4>Предоставленное решение</h4>
        </div>

        <div class="solution-link-block">
          <div class="file-item">
            <div class="file-info">
              <h4>Ссылка на решение (GitHub)</h4>
              <p class="file-description">
                Укажите ссылку на ваш GitHub репозиторий или облачное хранилище с решением
              </p>
            </div>
            <div class="file-actions">
              <template v-if="canEdit">
                <el-input
                    v-model="solutionLink"
                    placeholder="https://github.com/username/repo"
                    class="solution-link-input"
                >
                  <template #append>
                    <el-button
                        type="primary"
                        @click="saveSolutionLink"
                        :disabled="!solutionLink"
                    >
                      Сохранить
                    </el-button>
                  </template>
                </el-input>
              </template>
              <template v-if="!canEdit && solutionLink">
                <el-link
                    type="primary"
                    :href="solutionLink"
                    target="_blank"
                    class="solution-link"
                >
                  <el-icon>
                    <Link/>
                  </el-icon>
                  {{ solutionLink }}
                </el-link>
              </template>
            </div>
          </div>
        </div>

        <!-- ЗАКОММЕНТИРОВАНО: Загрузка ZIP файлов решений отключена -->
        <!-- <div v-if="solutionType === 'file'" class="file-item">
          <div class="file-info">
            <h4>ZIP архив с решением</h4>
            <p class="file-description">
              Архив должен содержать все файлы вашего решения до 500мб
            </p>
          </div>
          <div class="file-actions">
            <el-button
                v-if="solutionFile"
                type="primary"
                link
                @click="downloadFile('solution')"
            >
              <el-icon>
                <Download/>
              </el-icon>
              Скачать
            </el-button>
            <el-upload
                class="upload-btn"
                action="#"
                :auto-upload="false"
                :show-file-list="false"
                accept=".zip"
                :on-change="(file) => handleFileChange(file, 'solution')"
            >
              <el-button
                  type="primary"
                  v-if="canEdit"
                  :loading="uploadingSolution"
                  link
              >
                <el-icon>
                  <Upload/>
                </el-icon>
                {{ solutionFile ? 'Обновить' : 'Загрузить' }}
              </el-button>
            </el-upload>
            <el-progress
                v-if="uploadingSolution"
                :percentage="uploadProgress"
                :format="progressFormat"
                class="upload-progress"
            />
          </div>
        </div> -->
        </div>
      </div>

      <div class="deployment-card" v-if="authStore.isMember">
        <h3 class="card-title">Инструкция по развертыванию</h3>
        <div class="deployment-block">
        <div class="file-item">
          <div class="file-info">
            <p class="file-description">
              Текстовый файл с инструкцией по развертыванию решения (TXT или MD).
              Обязательно должен содержать все необходимые шаги для запуска вашего решения.
            </p>
          </div>
          <div class="file-actions">
            <el-button
                v-if="deploymentFile"
                type="primary"
                link
                @click="downloadFile('deployment')"
            >
              <el-icon>
                <Download/>
              </el-icon>
              Скачать
            </el-button>
            <el-upload
                class="upload-btn"
                action="#"
                :auto-upload="false"
                :show-file-list="false"
                accept=".txt,.md"
                :on-change="(file) => handleFileChange(file, 'deployment')"
            >
              <el-button
                  type="primary"
                  v-if="canEdit"
                  link
              >
                <el-icon>
                  <Upload/>
                </el-icon>
                {{ deploymentFile ? 'Обновить' : 'Загрузить' }}
              </el-button>
            </el-upload>
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue'
import {ElMessage} from 'element-plus'
import {Download, Link} from '@element-plus/icons-vue'
// ЗАКОММЕНТИРОВАНО: Upload больше не используется
// import {Upload} from '@element-plus/icons-vue'
import {teamsApi} from '@/api/teams'
import {useAuthStore} from "@/stores/auth.js"
import {useStageStore} from "@/stores/stage.js";

const authStore = useAuthStore()
const stageStore = useStageStore()

const props = defineProps({
  teamId: {
    type: String,
    required: true
  }
})

const loading = ref(false)
// ЗАКОММЕНТИРОВАНО: Загрузка файлов решений отключена
// const solutionFile = ref(null)
const deploymentFile = ref(null)
// const uploadingSolution = ref(false)
// const uploadProgress = ref(0)
// const solutionType = ref('file')
const solutionLink = ref('')

const canEdit = computed(() => {
  return authStore.isMember && (stageStore.isTaskDistribution || stageStore.isSolutionSubmission)
})

// ЗАКОММЕНТИРОВАНО: progressFormat больше не используется
// const progressFormat = (percentage) => {
//   if (percentage === 100) {
//     return 'Обработка...'
//   }
//   return `${percentage}%`
// }

const loadFiles = async () => {
  try {
    loading.value = true
    const team = await teamsApi.getTeam(props.teamId)
    solutionLink.value = team.solution_link || ''

    try {
      // ЗАКОММЕНТИРОВАНО: Загрузка файлов решений отключена
      // const solution = await teamsApi.getTeamSolution(props.teamId)
      const deployment = await teamsApi.getTeamDeployment(props.teamId)
      // solutionFile.value = solution
      deploymentFile.value = deployment

      // if (solution) {
      //   solutionType.value = 'file'
      // }
    } catch (error) {
      if (error.response?.status !== 404) {
        throw error
      }
    }
  } catch (error) {
    console.error('Error loading files:', error)
    if (error.response?.status !== 404) {
      ElMessage.error('Ошибка при загрузке файлов')
    }
  } finally {
    loading.value = false
  }
}

const saveSolutionLink = async () => {
  try {
    loading.value = true
    await teamsApi.updateSolutionLink(props.teamId, solutionLink.value)
    ElMessage.success('Ссылка на решение успешно сохранена')
  } catch (error) {
    console.error('Error saving solution link:', error)
    ElMessage.error('Ошибка при сохранении ссылки')
  } finally {
    loading.value = false
  }
}

const downloadFile = async (type) => {
  try {
    loading.value = true
    // ЗАКОММЕНТИРОВАНО: Загрузка файлов решений отключена
    // if (type === 'solution') {
    //   await teamsApi.downloadTeamSolution(props.teamId)
    // } else {
      await teamsApi.downloadTeamDeployment(props.teamId)
    // }
  } catch (error) {
    console.error(`Error downloading ${type}:`, error)
    ElMessage.error(error.message || `Ошибка при скачивании файла`)
  } finally {
    loading.value = false
  }
}

const handleFileChange = async (file, type) => {
  try {
    if (!file) return

    // ЗАКОММЕНТИРОВАНО: Загрузка файлов решений отключена
    // const maxSize = type === 'solution' ? 500 * 1024 * 1024 : 50 * 1024 * 1024
    const maxSize = 50 * 1024 * 1024
    if (file.raw.size > maxSize) {
      ElMessage.error(`Размер файла не должен превышать ${maxSize / (1024 * 1024)}MB`)
      return
    }

    // if (type === 'solution' && !file.raw.name.toLowerCase().endsWith('.zip')) {
    //   ElMessage.error('Решение должно быть в формате ZIP')
    //   return
    // }
    if (type === 'deployment' &&
        !file.raw.name.toLowerCase().endsWith('.txt') &&
        !file.raw.name.toLowerCase().endsWith('.md')) {
      ElMessage.error('Описание должно быть в формате TXT или MD')
      return
    }

    // ЗАКОММЕНТИРОВАНО: Загрузка файлов решений отключена
    // if (type === 'solution') {
    //   uploadingSolution.value = true
    //   uploadProgress.value = 0
    //
    //   await teamsApi.uploadTeamSolution(props.teamId, file.raw, (progress) => {
    //     uploadProgress.value = progress
    //   })
    //
    //   ElMessage.success('Решение успешно загружено')
    // } else {
      await teamsApi.uploadTeamDeployment(props.teamId, file.raw)
      ElMessage.success('Описание развертывания успешно загружено')
    // }

    await loadFiles()
  } catch (error) {
    console.error('Error uploading file:', error)
    ElMessage.error('Ошибка при загрузке файла')
  } finally {
    // if (type === 'solution') {
    //   uploadingSolution.value = false
    //   uploadProgress.value = 0
    // }
  }
}

onMounted(() => {
  loadFiles()
})
</script>

<style scoped>
.solution-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px; /* gap-6 */
}

.solution-container {
  display: flex;
  flex-direction: column;
  gap: 24px; /* gap-6 */
}

/* Card Styles */
.solution-card,
.deployment-card {
  background: white; /* bg-white */
  border-radius: 12px; /* rounded-xl */
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1); /* shadow-sm */
  border: 1px solid #e2e8f0; /* border border-slate-200 */
  padding: 24px; /* p-6 */
}

.card-title {
  font-size: 1.25rem; /* text-xl */
  font-weight: 600;
  color: #1e293b; /* text-slate-800 */
  margin: 0 0 20px 0;
}

.important-notice {
  background: #fff3f3;
  border: 1px solid #ffa4a4;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 0; /* Убираем margin, так как gap в контейнере */
}

.important-notice h4 {
  color: #f56c6c;
  margin: 0 0 8px 0;
}

.solution-block,
.deployment-block {
  width: 100%;
}

.solution-block h4 {
  margin: 0 0 16px 0;
  color: #333333;
  font-size: 1.1em;
}

.solution-type-selector {
  margin-bottom: 20px;
}

.solution-type-group {
  display: flex;
  gap: 20px;
}

.file-item {
  background: #f8f9fa;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.file-info {
  flex: 1;
}

.file-info h4 {
  margin: 0 0 8px 0;
  font-size: 1em;
}

.file-description {
  margin: 4px 0 0;
  color: #666666;
  font-size: 0.9em;
}

.warning-text {
  color: #f56c6c;
  font-weight: 500;
}

.file-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.solution-link-input {
  min-width: 300px;
}

.solution-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  word-break: break-all;
}

.solution-link .el-icon {
  font-size: 16px;
}

:deep(.el-button--link) {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #333333;
}

.upload-progress {
  margin-top: 10px;
  width: 200px;
}

@media (max-width: 768px) {
  .file-item {
    flex-direction: column;
    gap: 12px;
  }

  .file-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .upload-progress {
    width: 100%;
  }

  .solution-link-input {
    width: 100%;
    min-width: unset;
  }

  .solution-type-group {
    flex-direction: column;
    gap: 12px;
  }
}
</style>