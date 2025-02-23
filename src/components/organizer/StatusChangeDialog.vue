<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="50%"
  >
    <el-form>
      <el-form-item label="Комментарий">
        <el-input
          v-model="commentModel"
          type="textarea"
          rows="3"
          placeholder="Укажите причину изменения статуса"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Отмена</el-button>
        <el-button type="primary" @click="$emit('confirm')">
          Подтвердить
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  visible: Boolean,
  status: String,
  comment: String
})

const emit = defineEmits(['update:visible', 'update:comment', 'confirm'])

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const commentModel = computed({
  get: () => props.comment,
  set: (value) => emit('update:comment', value)
})

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
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>