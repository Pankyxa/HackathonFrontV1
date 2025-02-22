<template>
  <el-dialog
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      title="Редактирование информации"
      width="400px"
  >
    <div class="edit-form">
      <div class="form-group">
        <label>Название команды</label>
        <input type="text" v-model="localFormData.team_name" class="form-input"/>
      </div>
      <div class="form-group">
        <label>Девиз команды</label>
        <input type="text" v-model="localFormData.team_motto" class="form-input"/>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <button class="cancel-btn" @click="$emit('update:modelValue', false)">Отмена</button>
        <button
            class="save-btn"
            @click="handleSave"
            :disabled="loading"
        >
          {{ loading ? 'Сохранение...' : 'Сохранить' }}
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
  formData: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'save'])

const localFormData = ref({ ...props.formData })

watch(() => props.formData, (newVal) => {
  localFormData.value = { ...newVal }
})

const handleSave = () => {
  emit('save', localFormData.value)
}
</script>

<style scoped>
.edit-form {
  padding: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  color: #333;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
}

.cancel-btn,
.save-btn {
  padding: 8px 20px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: white;
  color: #606266;
  border: 1px solid #dcdfe6;
}

.cancel-btn:hover {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}

.save-btn {
  background: linear-gradient(90deg, #00A3FF 0%, #5B51D8 100%);
  color: white;
  border: none;
}

.save-btn:hover {
  opacity: 0.9;
}

.save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>