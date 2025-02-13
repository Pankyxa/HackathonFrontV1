<template>
  <el-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue')"
    title="Требуется авторизация"
    :width="isMobile ? '90%' : '30%'"
    :fullscreen="isMobile"
    center
  >
    <span>Для подачи заявки необходимо войти в систему</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleLogin" class="login-button">
          Войти
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted, onUnmounted } from 'vue';

const router = useRouter();
const isMobile = ref(window.innerWidth <= 768);

const handleResize = () => {
  isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

const handleLogin = () => {
  emit('update:modelValue', false);
  router.push('/login');
};
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: center;
  width: 100%;
}

:deep(.el-dialog) {
  border-radius: 16px;
}

:deep(.el-dialog__header) {
  text-align: center;
  padding: 20px;
  margin-right: 0;
  background: linear-gradient(90deg, #00A3FF 0%, #5B51D8 100%);
  color: white;
  border-radius: 16px 16px 0 0;
}

:deep(.el-dialog__title) {
  color: white;
  font-size: 18px;
  font-weight: bold;
}

  :deep(.el-dialog__body) {
  padding: 30px 20px;
  text-align: center;
  font-size: 16px;
  }

:deep(.el-dialog__footer) {
  padding: 20px;
  }

.login-button {
  background: linear-gradient(90deg, #00A3FF 0%, #5B51D8 100%);
  border: none;
  padding: 12px 40px;
  font-size: 16px;
  border-radius: 8px;
  transition: opacity 0.3s ease;
  }

.login-button:hover {
  opacity: 0.9;
  }

@media (max-width: 768px) {
  :deep(.el-dialog) {
    margin: 0 !important;
    position: fixed;
    left: 0;
    bottom: 0;
    right: 0;
    border-radius: 16px 16px 0 0;
}

  :deep(.el-dialog__body) {
    padding: 40px 20px;
    font-size: 18px;
  }

  .login-button {
    width: 100%;
    padding: 15px;
    font-size: 18px;
  }
}
</style>