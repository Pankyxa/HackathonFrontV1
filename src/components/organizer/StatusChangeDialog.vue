<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :width="isMobile ? '100%' : '50%'"
    :fullscreen="isMobile"
    class="status-change-dialog"
  >
    <el-form label-position="top">
      <el-form-item
        :label="status === 'approved' ? 'Комментарий (необязательно)' : 'Комментарий'"
        :required="status !== 'approved'"
        :error="commentError"
      >
        <el-input
          v-model="commentModel"
          type="textarea"
          :rows="isMobile ? 6 : 3"
          :placeholder="status === 'approved' ? 'Комментарий (необязательно)' : 'Укажите причину изменения статуса'"
          class="form-textarea"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Отмена</el-button>
        <el-button
          type="primary"
          @click="handleConfirm"
          :disabled="!isValid"
        >
          Подтвердить
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  visible: Boolean,
  status: String,
  comment: String
})

const emit = defineEmits(['update:visible', 'update:comment', 'confirm'])

const isMobile = computed(() => window.innerWidth <= 768)

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const commentModel = computed({
  get: () => props.comment,
  set: (value) => emit('update:comment', value)
})

const commentError = computed(() => {
  // Для статуса 'approved' комментарий необязателен
  if (props.status === 'approved') {
    return ''
  }
  return !commentModel.value?.trim() ? 'Комментарий обязателен' : ''
})

const isValid = computed(() => {
  // Для статуса 'approved' комментарий необязателен
  if (props.status === 'approved') {
    return true
  }
  return !!commentModel.value?.trim()
})

const handleConfirm = () => {
  if (isValid.value) {
    emit('confirm')
  }
}

const dialogTitle = computed(() => {
  const statusTexts = {
    approved: 'Подтверждение пользователя',
    need_update: 'Запрос обновления документов',
    rejected: 'Отклонение пользователя'
  }
  return statusTexts[props.status] || 'Изменение статуса'
})
</script>

<style scoped>
:deep(.el-form-item__label) {
  font-size: 14px;
  font-weight: 500;
  color: #334155;
  margin-bottom: 8px;
  padding-bottom: 0;
}

.form-textarea :deep(.el-textarea__inner) {
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  box-shadow: none;
  transition: all 0.2s ease;
  font-size: 16px;
  color: #1e293b;
}

.form-textarea :deep(.el-textarea__inner.is-focus) {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@media (max-width: 768px) {
  .dialog-footer {
    flex-direction: column;
    gap: 8px;
    padding: 0;
  }

  .dialog-footer .el-button {
    width: 100%;
    height: 44px;
    font-size: 15px;
    margin: 0;
  }
}

:deep(.status-change-dialog .el-dialog__body) {
  padding: 20px;
}

:deep(.status-change-dialog .el-dialog__header) {
  padding: 20px 20px 10px;
}

:deep(.status-change-dialog .el-dialog__footer) {
  padding: 10px 20px 20px;
}

@media (max-width: 768px) {
  :deep(.status-change-dialog .el-dialog__body) {
    padding: 16px;
    padding-bottom: 80px; /* Отступ для кнопок */
  }

  :deep(.status-change-dialog .el-dialog__header) {
    padding: 16px 16px 12px;
  }

  :deep(.status-change-dialog .el-dialog__title) {
    font-size: 18px;
  }

  :deep(.status-change-dialog .el-dialog__footer) {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 12px 16px;
    background: white;
    border-top: 1px solid #e4e7ed;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
    z-index: 2000;
  }

  :deep(.status-change-dialog .el-form-item__label) {
    font-size: 14px;
    margin-bottom: 8px;
  }

  :deep(.status-change-dialog .el-textarea__inner) {
    font-size: 14px;
    line-height: 1.6;
  }

  :deep(.status-change-dialog .el-form-item__error) {
    font-size: 12px;
    margin-top: 4px;
  }
}
</style>