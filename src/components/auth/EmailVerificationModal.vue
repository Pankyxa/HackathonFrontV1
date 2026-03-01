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
  line-height: 1.6;
  color: #475569; /* text-slate-600 */
  font-size: 0.875rem; /* text-sm */
}

.verification-footer {
  display: flex;
  justify-content: center;
}

/* Clean Corporate Dialog Styles */
:deep(.el-dialog) {
  border-radius: 12px; /* rounded-xl */
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); /* shadow-xl */
  border: 1px solid #e2e8f0; /* border-slate-200 */
  overflow: hidden;
}

:deep(.el-dialog__header) {
  padding: 24px 24px 16px 24px; /* p-6 pb-4 */
  border-bottom: 1px solid #e2e8f0; /* border-slate-200 */
  background: white;
}

:deep(.el-dialog__title) {
  font-size: 1.25rem; /* text-xl */
  font-weight: 600; /* font-semibold */
  color: #0f172a; /* text-slate-900 */
}

:deep(.el-dialog__headerbtn) {
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
}

:deep(.el-dialog__close) {
  color: #64748b; /* text-slate-500 */
  font-size: 18px;
}

:deep(.el-dialog__close:hover) {
  color: #475569; /* hover:text-slate-600 */
}

:deep(.el-dialog__body) {
  padding: 24px; /* p-6 */
  background: white;
}

:deep(.el-dialog__footer) {
  padding: 16px 24px 24px 24px; /* py-4 px-6 */
  border-top: 1px solid #e2e8f0; /* border-slate-200 */
  background: white;
}

/* Button styles */
:deep(.el-button) {
  border-radius: 8px; /* rounded-lg */
  font-weight: 500; /* font-medium */
  padding: 10px 16px; /* py-2.5 px-4 */
  transition: all 0.2s ease;
}

:deep(.el-button:not(.el-button--primary)) {
  background: white;
  border-color: #cbd5e1; /* border-slate-300 */
  color: #475569; /* text-slate-600 */
}

:deep(.el-button:not(.el-button--primary):hover) {
  background: #f8fafc; /* hover:bg-slate-50 */
  border-color: #94a3b8; /* hover:border-slate-400 */
  color: #334155; /* hover:text-slate-700 */
}

@media (max-width: 768px) {
  :deep(.el-dialog) {
    width: 100% !important;
    margin: 0 !important;
    border-radius: 0;
    max-height: 100vh;
  }

  :deep(.el-dialog__body) {
    padding: 20px !important;
  }

  :deep(.el-dialog__header) {
    padding: 20px !important;
  }

  :deep(.el-dialog__footer) {
    padding: 20px !important;
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