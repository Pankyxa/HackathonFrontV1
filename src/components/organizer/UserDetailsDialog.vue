<template>
  <el-dialog
      v-model="dialogVisible"
      title="Проверка документов пользователя"
      class="user-details-dialog clean-corporate-modal"
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
import { computed } from 'vue'
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
  .user-details-content {
    padding-bottom: 100px; /* Отступ снизу для фиксированных кнопок */
  }
  
  .actions-section {
    flex-direction: column;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background: white;
    padding: 12px 16px;
    margin: 0;
    border-top: 1px solid #e4e7ed;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
    z-index: 100;
    gap: 8px;
  }

  .actions-section .el-button {
    width: 100%;
    height: 44px;
    font-size: 15px;
    margin: 0;
  }
}
</style>