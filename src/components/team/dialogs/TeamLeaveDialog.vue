<template>
  <el-dialog
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      title="Подтверждение выхода из команды"
      width="400px"
      class="leave-dialog"
  >
    <div class="leave-confirmation">
      <p class="leave-warning">
        Вы уверены, что хотите покинуть команду "{{ teamName }}"?
      </p>
      <p class="leave-description">
        Для повторного вступления вам потребуется новое приглашение от лидера команды.
      </p>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <button class="cancel-btn" @click="$emit('update:modelValue', false)">
          Отмена
        </button>
        <button
            class="leave-confirm-btn"
            @click="$emit('confirm')"
            :disabled="leaving"
        >
          {{ leaving ? 'Выход...' : 'Покинуть команду' }}
        </button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  teamName: {
    type: String,
    required: true
  },
  leaving: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue', 'confirm'])
</script>

<style scoped>
.leave-confirmation {
  padding: 1rem;
}

.leave-warning {
  font-weight: 500;
  color: #909399;
  margin-bottom: 1rem;
}

.leave-description {
  color: #606266;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
}

.cancel-btn {
  background: white;
  color: #606266;
  border: 1px solid #dcdfe6;
  padding: 8px 20px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}

.leave-confirm-btn {
  background: #909399;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.leave-confirm-btn:hover {
  background: #a6a9ad;
}

.leave-confirm-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>