<template>
  <div class="documents-section">
    <h3 class="section-title">Мои документы</h3>
    <div v-loading="loading" class="documents-container">
      <template v-if="userDocuments.length">
        <div
            v-for="doc in userDocuments"
            :key="doc.id"
            class="document-preview"
        >
          <iframe
              v-if="doc.url"
              :src="doc.url"
              class="pdf-viewer"
              type="application/pdf"
          ></iframe>
          <div class="document-info">
            <span>{{ doc.name }}</span>
            <div class="document-actions">
              <el-button
                  type="primary"
                  link
                  @click="downloadDocument(doc)"
              >
                <el-icon><Download /></el-icon>
                Скачать
              </el-button>
              <el-upload
                  class="upload-btn"
                  action="#"
                  :auto-upload="false"
                  :show-file-list="false"
                  accept="application/pdf"
                  :on-change="(file) => handleFileChange(file, getDocumentType(doc.description))"
              >
                <el-button v-if="canEdit" type="primary" link>
                  <el-icon><Upload /></el-icon>
                  {{ doc.url ? 'Обновить' : 'Загрузить' }}
                </el-button>
              </el-upload>
            </div>
          </div>
        </div>
      </template>
      <el-empty v-else description="Документы не найдены"/>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Download, Upload } from '@element-plus/icons-vue'
import { usersApi } from '@/api/users'

const props = defineProps({
  userData: {
    type: Object,
    required: true
  },
  canEdit: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update'])
const loading = ref(false)
const userDocuments = ref([])

const hasParticipantRole = computed(() => {
  return props.userData?.roles?.some(role => role.name === 'participant')
})

const hasMentorRole = computed(() => {
  return props.userData?.roles?.some(role => role.name === 'mentor')
})

const getDocumentType = (description) => {
  if (description.includes('Согласие')) return 'consent'
  if (description.includes('Сертификат')) return 'certificate'
  return ''
}

const downloadDocument = (document) => {
  window.open(document.url, '_blank')
}

const handleFileChange = async (file, documentType) => {
  try {
    if (!file) return

    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.raw.size > maxSize) {
      ElMessage.error('Размер файла не должен превышать 5MB')
      return
    }

    if (file.raw.type !== 'application/pdf') {
      ElMessage.error('Допустимый формат файла: PDF')
      return
    }

    const updatedUser = await usersApi.updateUserDocuments(file.raw, documentType)
    emit('update', updatedUser)
    ElMessage.success('Документ успешно загружен')
    await loadDocuments() // Перезагружаем документы после успешной загрузки
  } catch (error) {
    console.error('Error uploading file:', error)
    ElMessage.error('Ошибка при загрузке файла')
  }
}

const loadDocuments = async () => {
  try {
    loading.value = true
    const docs = await usersApi.getUserDocuments(props.userData.id)

    userDocuments.value = docs.map(doc => {
      let displayName = 'Документ'
      if (doc.description.includes('Сертификат')) {
        displayName = hasParticipantRole.value ? 'Справка с места учебы' : 'Справка с места работы'
      } else if (doc.description.includes('Согласие')) {
        displayName = 'Согласие на обработку ПД'
      }

      return {
        id: doc.id,
        name: displayName,
        description: doc.description,
        url: doc.url
      }
    })
  } catch (error) {
    console.error('Error loading documents:', error)
    ElMessage.error('Ошибка при загрузке документов')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDocuments()
})
</script>

<style scoped>
.documents-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  color: #333333;
}

.section-title {
  color: #333333;
  margin: 0 0 16px 0;
}

.documents-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 16px;
}

.document-preview {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.pdf-viewer {
  width: 100%;
  height: 400px;
  border: none;
}

.document-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: white;
  color: #333333;
}

.document-info span {
  color: #333333;
}

.document-name {
  color: #333333;
}

.document-actions {
  display: flex;
  gap: 12px;
}

:deep(.el-button--link) {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #333333;
}

:deep(.el-empty__description) {
  color: #333333;
}

@media (max-width: 768px) {
  .documents-container {
    grid-template-columns: 1fr;
  }
}
</style>