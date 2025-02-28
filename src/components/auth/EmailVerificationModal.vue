<template>
  <el-dialog
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      title="Подтверждение email"
      width="400px"
      :close-on-click-modal="false"
      class="verification-modal"
  >
    <div class="verification-content">
      <p>На вашу почту {{ email }} было отправлено письмо для подтверждения.</p>
      <p>Пожалуйста, проверьте свою почту и перейдите по ссылке в письме для подтверждения регистрации.</p>
    </div>
    <template #footer>
      <div class="verification-footer">
        <el-button @click="$emit('update:modelValue', false)">
          Закрыть
        </el-button>
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
  email: {
    type: String,
    required: true
  }
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
.verification-content {
  text-align: center;
  padding: 20px 0;
}

.verification-content p {
  margin: 10px 0;
  line-height: 1.5;
}

.verification-footer {
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  :deep(.el-dialog) {
    width: 90% !important;
    margin: 10px auto !important;
  }

  :deep(.el-dialog__body) {
    padding: 15px !important;
  }

  :deep(.el-dialog__header) {
    padding: 15px !important;
  }

  :deep(.el-dialog__footer) {
    padding: 15px !important;
  }

  .verification-content {
    padding: 10px 0;
  }

  .verification-content p {
    font-size: 14px;
  }

  .verification-footer {
    flex-direction: column;
    gap: 10px;
  }

  .verification-footer :deep(.el-button) {
    width: 100%;
    margin-left: 0 !important;
  }
}
</style>