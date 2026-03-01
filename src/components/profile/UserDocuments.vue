<template>
  <div class="documents-section">
    <div v-loading="loading" class="documents-container">
      <template v-if="userDocuments.length">
        <div class="documents-grid">
          <div
              v-for="doc in userDocuments"
              :key="doc.id"
              class="file-item"
          >
            <!-- Left: File Icon -->
            <div class="file-icon-wrapper">
              <el-icon class="file-icon-large"><Document /></el-icon>
            </div>
            
            <!-- Center: Filename + Label -->
            <div class="file-info">
              <div class="file-name" :title="doc.name">
                {{ doc.name }}
              </div>
              <div class="file-label">PDF</div>
            </div>
            
            <!-- Right: Action Buttons -->
            <div class="file-actions">
              <button
                  v-if="doc.url"
                  class="action-icon-btn"
                  @click="previewDocument(doc)"
                  title="Просмотр"
              >
                <el-icon><View /></el-icon>
              </button>
              <button
                  v-if="doc.url"
                  class="action-icon-btn"
                  @click="downloadDocument(doc)"
                  title="Скачать"
              >
                <el-icon><Download /></el-icon>
              </button>
              <el-upload
                  v-if="canEdit && stageStore.isRegistration"
                  class="upload-btn-inline"
                  action="#"
                  :auto-upload="false"
                  :show-file-list="false"
                  accept="application/pdf,image/jpeg,image/jpg,image/png"
                  :on-change="(file) => handleFileChange(file, getDocumentType(doc.description))"
              >
                <button class="action-icon-btn" :title="doc.url ? 'Обновить' : 'Загрузить'">
                  <el-icon><Upload /></el-icon>
                </button>
              </el-upload>
            </div>
          </div>
        </div>
      </template>
      <!-- Upload Zone for Missing Documents -->
      <div
          v-if="canEdit && stageStore.isRegistration && userDocuments.length > 0 && userDocuments.some(doc => !doc.url)"
          class="upload-zone"
      >
        <el-upload
            class="upload-area"
            action="#"
            drag
            :auto-upload="false"
            :show-file-list="false"
            accept="application/pdf,image/jpeg,image/jpg,image/png"
            :on-change="handleUploadZoneChange"
        >
          <div class="upload-content">
            <el-icon class="upload-icon"><Upload /></el-icon>
            <div class="upload-text">
              <div class="upload-title">Загрузить документ</div>
              <div class="upload-hint">Перетащите файл сюда или нажмите для выбора</div>
              <div class="upload-formats">Поддерживаемые форматы: PDF, JPG, PNG (до 5MB)</div>
            </div>
          </div>
        </el-upload>
      </div>
      <el-empty v-if="!loading && userDocuments.length === 0" description="Документы не найдены"/>
    </div>
    
    <!-- Preview Modal - Full Screen Overlay -->
    <div
        v-if="previewVisible"
        class="preview-modal-overlay"
        @click.self="closePreview"
    >
      <div class="preview-modal-content">
        <div class="preview-modal-header">
          <h3 class="preview-modal-title">{{ previewDocumentName }}</h3>
          <button class="preview-close-btn" @click="closePreview">
            <el-icon><Close /></el-icon>
          </button>
        </div>
        <div class="preview-container">
          <iframe
              v-if="previewUrl"
              :src="previewUrl"
              class="preview-iframe"
              frameborder="0"
          ></iframe>
          <div v-else class="preview-error">
            <p>Не удалось загрузить документ для просмотра</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
import { Download, Upload, Document, View, Close } from '@element-plus/icons-vue'
import { usersApi } from '@/api/users'
import { useStageStore} from "@/stores/stage.js"

const stageStore = useStageStore()

// Preview Modal State
const previewVisible = ref(false)
const previewUrl = ref('')
const previewDocumentName = ref('')
const currentPreviewDocument = ref(null)

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

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

const previewDocument = (document) => {
  if (!document.url) {
    ElMessage.warning('Документ не загружен')
    return
  }
  previewUrl.value = document.url
  previewDocumentName.value = document.name
  currentPreviewDocument.value = document
  previewVisible.value = true
}

const closePreview = () => {
  previewVisible.value = false
  previewUrl.value = ''
  previewDocumentName.value = ''
  currentPreviewDocument.value = null
}

const downloadPreviewDocument = () => {
  if (currentPreviewDocument.value) {
    downloadDocument(currentPreviewDocument.value)
  }
}

const handleFileChange = async (file, documentType) => {
  try {
    if (!file) return

    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.raw.size > maxSize) {
      ElMessage.error('Размер файла не должен превышать 5MB')
      return
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    if (!allowedTypes.includes(file.raw.type)) {
      ElMessage.error('Допустимые форматы файла: PDF, JPG, PNG')
      return
    }

    const updatedUser = await usersApi.updateUserDocuments(file.raw, documentType)
    emit('update', updatedUser)
    ElMessage.success('Документ успешно загружен')
    await loadDocuments()
  } catch (error) {
    console.error('Error uploading file:', error)
    ElMessage.error('Ошибка при загрузке файла')
  }
}

const handleUploadZoneChange = async (file) => {
  // Определяем тип документа по первому незагруженному документу
  const missingDoc = userDocuments.value.find(doc => !doc.url)
  if (!missingDoc) {
    ElMessage.warning('Все документы уже загружены')
    return
  }
  
  const documentType = getDocumentType(missingDoc.description)
  await handleFileChange(file, documentType)
}

const loadDocuments = async () => {
  try {
    loading.value = true
    const docs = await usersApi.getUserDocuments(props.userData.id)

    userDocuments.value = docs.map(doc => {
      let displayName = 'Документ'
      if (doc.description.includes('Сертификат')) {
        displayName = hasParticipantRole.value ? 'Справка с места учебы/работы' : 'Справка с места работы'
      } else if (doc.description.includes('Согласие')) {
        displayName = 'Согласие на обработку ПД'
      }

      return {
        id: doc.id,
        name: displayName,
        description: doc.description,
        url: doc.url,
        uploadDate: doc.created_at || doc.uploaded_at || null
      }
    })
  } catch (error) {
    console.error('Error loading documents:', error)
    ElMessage.error('Ошибка при загрузке документов')
  } finally {
    loading.value = false
  }
}

const handleEscape = (event) => {
  if (event.key === 'Escape' && previewVisible.value) {
    closePreview()
  }
}

onMounted(() => {
  loadDocuments()
  window.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
.documents-section {
  width: 100%;
}

.documents-container {
  width: 100%;
  padding: 0; /* Убираем внутренние отступы */
}

/* Documents Grid */
.documents-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr); /* grid-cols-1 */
  gap: 16px; /* gap-4 */
}

@media (min-width: 768px) {
  .documents-grid {
    grid-template-columns: repeat(2, 1fr); /* md:grid-cols-2 */
  }
}

@media (min-width: 1024px) {
  .documents-grid {
    grid-template-columns: repeat(3, 1fr); /* lg:grid-cols-3 */
  }
}

/* File Item */
.file-item {
  display: flex;
  align-items: center;
  padding: 16px; /* p-4 */
  border: 1px solid #e2e8f0; /* border border-slate-200 */
  border-radius: 8px; /* rounded-lg */
  background: white; /* bg-white */
  transition: all 0.2s ease;
  gap: 12px;
}

.file-item:hover {
  border-color: #60a5fa; /* hover:border-blue-400 */
}

/* Left: File Icon */
.file-icon-wrapper {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
}

.file-icon-large {
  font-size: 32px;
  color: #94a3b8; /* text-slate-400 */
}

/* Center: Filename + Label */
.file-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.file-name {
  font-size: 0.875rem; /* text-sm */
  font-weight: 500;
  color: #1e293b; /* text-slate-800 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-label {
  font-size: 0.75rem; /* text-xs */
  color: #64748b; /* text-slate-500 */
}

/* Right: Action Buttons */
.file-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.action-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: transparent;
  color: #64748b; /* text-slate-500 */
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.action-icon-btn:hover {
  color: #2563eb; /* hover:text-blue-600 */
  background: #f1f5f9; /* hover:bg-slate-100 */
}

.action-icon-btn .el-icon {
  font-size: 18px;
}

.upload-btn-inline {
  display: inline-block;
}

:deep(.el-button) {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

:deep(.el-empty__description) {
  color: #64748b; /* text-slate-500 */
}

/* Upload Zone */
.upload-zone {
  margin-top: 16px;
}

.upload-area {
  width: 100%;
}

:deep(.upload-area .el-upload) {
  width: 100%;
}

:deep(.upload-area .el-upload-dragger) {
  width: 100%;
  border: 2px dashed #cbd5e1 !important; /* border-dashed border-2 border-slate-300 */
  border-radius: 8px !important; /* rounded-lg */
  background: #f8fafc !important; /* bg-slate-50 */
  padding: 32px;
  transition: all 0.2s ease;
  border-color: #cbd5e1 !important; /* border-slate-300 */
}

:deep(.upload-area .el-upload-dragger:hover) {
  border-color: #93c5fd !important; /* hover:border-blue-300 */
  background: #f1f5f9 !important; /* hover:bg-slate-100 */
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}

.upload-icon {
  font-size: 48px;
  color: #64748b; /* text-slate-500 */
}

.upload-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.upload-title {
  font-size: 1rem; /* text-base */
  font-weight: 600;
  color: #1e293b; /* text-slate-800 */
}

.upload-hint {
  font-size: 0.875rem; /* text-sm */
  color: #64748b; /* text-slate-500 */
}

.upload-formats {
  font-size: 0.75rem; /* text-xs */
  color: #94a3b8; /* text-slate-400 */
  margin-top: 4px;
}

/* Preview Modal - Full Screen Overlay */
.preview-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999; /* Очень высокий z-index для перекрытия всего */
  background: white; /* Белый фон на весь экран */
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
}

.preview-modal-content {
  width: 100%;
  height: 100%;
  max-width: 100%;
  background: white;
  border-radius: 0;
  display: flex;
  flex-direction: column;
  box-shadow: none;
  overflow: hidden;
}

.preview-modal-header {
  position: sticky; /* Sticky header */
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #e2e8f0;
  background: white; /* Белый фон для header */
  flex-shrink: 0;
}

.preview-modal-title {
  font-size: 1.125rem; /* text-lg */
  font-weight: 600;
  color: #1e293b; /* text-slate-800 */
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  margin-right: 16px;
}

.preview-close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid #e2e8f0; /* border-slate-200 */
  background: white; /* bg-white */
  color: #64748b; /* text-slate-500 */
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.preview-close-btn:hover {
  background: #f1f5f9; /* hover:bg-slate-50 */
  border-color: #cbd5e1; /* hover:border-slate-300 */
  color: #475569; /* hover:text-slate-600 */
}

.preview-close-btn:active {
  background: #e2e8f0; /* active:bg-slate-200 */
}

.preview-close-btn .el-icon {
  font-size: 18px;
  font-weight: 500;
}

.preview-container {
  flex: 1;
  width: 100%;
  height: calc(100vh - 73px); /* Высота минус header */
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc; /* bg-slate-50 */
  overflow: hidden;
  position: relative;
  min-height: 0;
}

.preview-iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: white;
}

.preview-error {
  padding: 40px;
  text-align: center;
  color: #64748b; /* text-slate-500 */
}

@media (max-width: 768px) {
  .documents-grid {
    grid-template-columns: 1fr;
    gap: 8px; /* Минимальный gap */
  }
  
  /* Максимально компактные карточки документов на мобильных */
  .file-item {
    padding: 8px 10px; /* Минимальный padding */
    gap: 8px; /* Минимальный gap */
    min-height: auto;
    align-items: center; /* Выравнивание по центру */
  }
  
  .file-icon-wrapper {
    width: 32px; /* Еще меньше */
    height: 32px;
    flex-shrink: 0;
  }
  
  .file-icon-large {
    font-size: 18px; /* Еще меньше */
  }
  
  .file-info {
    min-width: 0;
    flex: 1;
    gap: 2px; /* Минимальный gap между именем и меткой */
  }
  
  .file-name {
    font-size: 0.8125rem; /* text-sm */
    line-height: 1.2; /* Компактный line-height */
    margin: 0;
  }
  
  .file-label {
    font-size: 0.6875rem; /* text-xs */
    line-height: 1;
    margin: 0;
  }
  
  .file-actions {
    gap: 4px; /* Минимальный gap между кнопками */
    flex-shrink: 0;
  }
  
  .action-icon-btn {
    width: 28px; /* Компактные кнопки */
    height: 28px;
    padding: 0;
  }
  
  .action-icon-btn .el-icon {
    font-size: 14px; /* Меньше иконки */
  }
  
  /* Компактная кнопка загрузки на мобилке */
  .upload-btn-inline :deep(.el-upload) {
    display: inline-block;
  }
  
  .upload-btn-inline .action-icon-btn {
    width: 28px;
    height: 28px;
  }
  
  .upload-btn-inline .action-icon-btn .el-icon {
    font-size: 14px;
  }
  
  .preview-container {
    height: calc(100vh - 73px);
  }
}
</style>