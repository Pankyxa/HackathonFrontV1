<template>
  <div class="documents-section">
    <h3>Документы</h3>
    <div v-loading="loading" class="documents-container">
      <template v-if="documents.length">
        <div 
          v-for="doc in documents" 
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
            <el-button 
              type="primary" 
              link 
              @click="downloadDocument(doc)"
            >
              Скачать
            </el-button>
          </div>
        </div>
      </template>
      <el-empty v-else description="Документы не найдены"/>
    </div>
  </div>
</template>

<script setup>
defineProps({
  documents: {
    type: Array,
    required: true
  },
  loading: Boolean
})

const downloadDocument = (document) => {
  window.open(document.url, '_blank')
}
</script>

<style scoped>
.documents-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.documents-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
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
}

@media (max-width: 768px) {
  .documents-container {
    grid-template-columns: 1fr;
  }
}
</style>