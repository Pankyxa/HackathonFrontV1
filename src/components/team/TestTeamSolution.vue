<template>
  <div class="solution-section">
    <h3 class="section-title">Решение команды</h3>
    <div v-loading="loading" class="solution-container">
      <div class="solution-files">
        <div class="file-item">
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
              <el-button type="primary"
                         :loading="uploadingSolution"
                         link>
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
        </div>

        <div class="file-item">
          <div class="file-info">
            <h4>Описание развертывания</h4>
            <p class="file-description">
              Текстовый файл с инструкцией по развертыванию решения (TXT или MD)
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
              <el-button type="primary"
                         link>
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
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {ElMessage} from 'element-plus'
import {Download, Upload} from '@element-plus/icons-vue'
import {teamsApi} from '@/api/teams'

const props = defineProps({
  teamId: {
    type: String,
    required: true
  }
})

const loading = ref(false)
const solutionFile = ref(null)
const deploymentFile = ref(null)
const uploadingSolution = ref(false)
const uploadProgress = ref(0)
const progressFormat = (percentage) => {
  if (percentage === 100) {
    return 'Обработка...'
  }
  return `${percentage}%`
}

const loadFiles = async () => {
  try {
    loading.value = true
    const solution = await teamsApi.getTeamSolution(props.teamId)
    const deployment = await teamsApi.getTeamDeployment(props.teamId)

    solutionFile.value = solution
    deploymentFile.value = deployment
  } catch (error) {
    console.error('Error loading files:', error)
    if (error.response?.status !== 404) {
      ElMessage.error('Ошибка при загрузке файлов')
    }
  } finally {
    loading.value = false
  }
}

const downloadFile = async (type) => {
  try {
    loading.value = true
    if (type === 'solution') {
      await teamsApi.downloadTeamSolution(props.teamId)
    } else {
      await teamsApi.downloadTeamDeployment(props.teamId)
    }
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

    const maxSize = type === 'solution' ? 500 * 1024 * 1024 : 50 * 1024 * 1024
    if (file.raw.size > maxSize) {
      ElMessage.error(`Размер файла не должен превышать ${maxSize / (1024 * 1024)}MB`)
      return
    }

    if (type === 'solution' && !file.raw.name.toLowerCase().endsWith('.zip')) {
      ElMessage.error('Решение должно быть в формате ZIP')
      return
    }
    if (type === 'deployment' &&
        !file.raw.name.toLowerCase().endsWith('.txt') &&
        !file.raw.name.toLowerCase().endsWith('.md')) {
      ElMessage.error('Описание должно быть в формате TXT или MD')
      return
    }
    if (type === 'solution') {
      uploadingSolution.value = true
      uploadProgress.value = 0

      await teamsApi.uploadTeamSolution(props.teamId, file.raw, (progress) => {
        uploadProgress.value = progress
      })

      ElMessage.success('Решение успешно загружено')
    } else {
      await teamsApi.uploadTeamDeployment(props.teamId, file.raw)
      ElMessage.success('Описание развертывания успешно загружено')
    }

    await loadFiles()
  } catch (error) {
    console.error('Error uploading file:', error)
    ElMessage.error('Ошибка при загрузке файла')
  } finally {
    if (type === 'solution') {
      uploadingSolution.value = false
      uploadProgress.value = 0
    }
  }
}

onMounted(() => {
  loadFiles()
})
</script>

<style scoped>
.solution-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  color: #333333;
}

.section-title {
  color: #333333;
  margin: 0 0 16px 0;
}

.solution-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.solution-files {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.file-item {
  background: white;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.file-info {
  flex: 1;
}

.file-info h4 {
  margin: 0;
  color: #333333;
}

.file-description {
  margin: 4px 0 0;
  color: #666666;
  font-size: 0.9em;
}

.file-actions {
  display: flex;
  gap: 12px;
  align-items: center;
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
}
</style>