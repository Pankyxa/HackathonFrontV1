<template>
  <el-dialog
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      title="Подтверждение удаления"
      width="400px"
  >
    <div class="confirm-content">
      <p>Вы действительно хотите удалить участника {{ member?.user.full_name }} из команды?</p>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <button class="cancel-btn" @click="$emit('update:modelValue', false)">Отмена</button>
        <button
            class="confirm-btn"
            @click="$emit('confirm')"
            :disabled="removing"
        >
          {{ removing ? 'Удаление...' : 'Удалить' }}
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
  member: {
    type: Object,
    required: true
  },
  removing: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue', 'confirm'])
</script>

<style scoped>
.confirm-content {
  padding: 1rem;
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

.confirm-btn {
  padding: 8px 20px;
  background: #f56c6c;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.confirm-btn:hover {
  opacity: 0.9;
}

.confirm-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>