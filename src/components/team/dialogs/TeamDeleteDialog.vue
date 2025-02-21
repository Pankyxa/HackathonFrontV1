<template>
  <el-dialog
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      title="Подтверждение удаления команды"
      width="400px"
      class="delete-dialog"
  >
    <div class="delete-confirmation">
      <p class="delete-warning">
        Вы уверены, что хотите удалить команду "{{ teamName }}"?
      </p>
      <p class="delete-description">
        Это действие нельзя будет отменить. Все данные команды будут удалены безвозвратно.
      </p>
      <div class="confirmation-input">
        <label>Для подтверждения введите название команды:</label>
        <input
            type="text"
            v-model="confirmationText"
            :placeholder="teamName"
            class="confirm-input"
        />
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <button class="cancel-btn" @click="$emit('update:modelValue', false)">
          Отмена
        </button>
        <button
            class="delete-confirm-btn"
            @click="$emit('confirm')"
            :disabled="confirmationText !== teamName || deleting"
        >
          {{ deleting ? 'Удаление...' : 'Удалить команду' }}
        </button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  teamName: {
    type: String,
    required: true
  },
  deleting: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const confirmationText = ref('')

watch(() => props.modelValue, (newValue) => {
  if (!newValue) {
    confirmationText.value = ''
  }
})
</script>

<style scoped>
.delete-confirmation {
  padding: 1rem;
}

.delete-warning {
  font-weight: 500;
  color: #f56c6c;
  margin-bottom: 1rem;
}

.delete-description {
  color: #606266;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.confirmation-input {
  margin-top: 1.5rem;
}

.confirmation-input label {
  display: block;
  margin-bottom: 0.5rem;
  color: #606266;
  font-size: 0.9rem;
}

.confirm-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  color: #f56c6c;
}

.confirm-input:focus {
  border-color: #f56c6c;
  outline: none;
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

.delete-confirm-btn {
  background: #f56c6c;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.delete-confirm-btn:hover {
  background: #f78989;
}

.delete-confirm-btn:disabled {
  background: #fbc4c4;
  cursor: not-allowed;
}
</style>