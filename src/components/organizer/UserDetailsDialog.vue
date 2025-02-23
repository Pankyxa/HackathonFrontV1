<template>
  <el-dialog
      v-model="dialogVisible"
      title="Проверка документов пользователя"
      class="user-details-dialog"
      :width="isMobile ? '100%' : '80%'"
      :fullscreen="isMobile"
  >
    <div v-loading="loading" class="user-details-content">
      <UserInfo :user="user" />

      <DocumentsSection
          :loading="documentsLoading"
          :documents="documents"
      />

      <div class="actions-section">
        <el-button
            type="warning"
            @click="$emit('status-change', user, 'need_update')"
        >
          Отправить на изменение личных данных
        </el-button>
        <el-button
            type="success"
            @click="$emit('status-change', user, 'approved')"
        >
          Подтвердить
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import UserInfo from './UserInfo.vue'
import DocumentsSection from './DocumentsSection.vue'

const props = defineProps({
  visible: Boolean,
  user: Object,
  loading: Boolean,
  documents: Array,
  documentsLoading: Boolean
})

const emit = defineEmits(['update:visible', 'status-change'])

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const isMobile = computed(() => window.innerWidth <= 768)

const addDialogStyles = () => {
  const style = document.createElement('style')
  style.id = 'user-details-dialog-styles'
  style.innerHTML = `
    .user-details-dialog .el-dialog {
      width: 80vh !important;
    }
    .user-details-dialog .el-dialog__body {
      padding: 20px;
      height: 70vh;
      overflow: hidden;
    }
    @media (max-width: 768px) {
      .user-details-dialog .el-dialog__body {
        height: calc(100vh - 66px) !important;
        padding: 16px;
      }
    }
  `
  document.head.appendChild(style)
}

const removeDialogStyles = () => {
  const style = document.getElementById('user-details-dialog-styles')
  if (style) {
    style.remove()
  }
}

onMounted(() => {
  addDialogStyles()
})

onUnmounted(() => {
  removeDialogStyles()
})
</script>

<style scoped>
.user-details-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 100%;
  overflow-y: auto;
  padding-right: 10px;
}

.user-details-content::-webkit-scrollbar {
  width: 8px;
}

.user-details-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.user-details-content::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.user-details-content::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.actions-section {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .actions-section {
    flex-direction: column;
  }

  .actions-section .el-button {
    width: 100%;
    margin: 0 0 0 10px;
  }
}
</style>