<template>
  <div class="documents-section">
    <div v-loading="loading" class="documents-container">
      <template v-if="documents.length">
        <div class="documents-grid">
          <div
              v-for="doc in documents"
              :key="doc.id"
              class="file-item"
          >
            <!-- Left: File Icon -->
            <div class="file-icon-wrapper">
              <el-icon class="file-icon-large"><Document /></el-icon>
            </div>
            
            <!-- Center: Filename + Label -->
            <div class="file-info">
              <div class="file-name" :title="getDocumentName(doc)">
                {{ getDocumentName(doc) }}
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
            </div>
          </div>
        </div>
      </template>
      <el-empty v-if="!loading && documents.length === 0" description="Документы не найдены"/>
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
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Download, Document, View, Close } from '@element-plus/icons-vue'

const props = defineProps({
  documents: {
    type: Array,
    required: true
  },
  loading: Boolean
})

// Preview Modal State
const previewVisible = ref(false)
const previewUrl = ref('')
const previewDocumentName = ref('')
const currentPreviewDocument = ref(null)

const getDocumentName = (doc) => {
  if (doc.description) {
    if (doc.description.includes('Сертификат') || doc.description.includes('Справка')) {
      return 'Справка с места учебы/работы'
    } else if (doc.description.includes('Согласие')) {
      return 'Согласие на обработку ПД'
    }
  }
  return doc.name || 'Документ'
}

const downloadDocument = (document) => {
  if (document.url) {
    window.open(document.url, '_blank')
  }
}

const previewDocument = (document) => {
  if (!document.url) {
    return
  }
  previewUrl.value = document.url
  previewDocumentName.value = getDocumentName(document)
  currentPreviewDocument.value = document
  previewVisible.value = true
}

const closePreview = () => {
  previewVisible.value = false
  previewUrl.value = ''
  previewDocumentName.value = ''
  currentPreviewDocument.value = null
}

const handleEscape = (event) => {
  if (event.key === 'Escape' && previewVisible.value) {
    closePreview()
  }
}

onMounted(() => {
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

:deep(.el-empty__description) {
  color: #64748b; /* text-slate-500 */
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
  
  .preview-container {
    height: calc(100vh - 73px);
  }
}
</style>