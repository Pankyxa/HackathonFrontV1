<template>
  <el-dialog
      v-model="visible"
      title="Подтверждение email"
      width="30%"
      :close-on-click-modal="false"
      :show-close="false"
  >
    <div class="verification-modal">
      <el-icon class="verification-modal__icon" :size="48">
        <el-icon-message />
      </el-icon>
      <p class="verification-modal__text">
        На ваш email {{ email }} было отправлено письмо для подтверждения.
        Пожалуйста, проверьте почту и следуйте инструкциям в письме.
      </p>
      <p class="verification-modal__subtext">
        Если вы не получили письмо, проверьте папку "Спам" или нажмите кнопку ниже для повторной отправки.
      </p>
      <div class="verification-modal__actions">
        <el-button
            type="primary"
            @click="handleResend"
            :loading="loading"
            :disabled="countdown > 0"
        >
          {{ resendButtonText }}
        </el-button>
        <el-button @click="handleClose">Закрыть</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { authApi } from '@/api/auth.js';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  email: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const loading = ref(false);
const countdown = ref(0);

const resendButtonText = computed(() => {
  if (countdown.value > 0) {
    return `Повторная отправка через ${countdown.value} сек.`;
  }
  return 'Отправить письмо повторно';
});

const startCountdown = () => {
  countdown.value = 300; // 5 минут
  const timer = setInterval(() => {
    countdown.value--;
    if (countdown.value === 0) {
      clearInterval(timer);
    }
  }, 1000);
};

const handleResend = async () => {
  try {
    loading.value = true;
    await authApi.resendVerificationEmail(props.email);
    ElMessage.success('Письмо успешно отправлено');
    startCountdown();
  } catch (error) {
    ElMessage.error(error?.detail || 'Ошибка при отправке письма');
  } finally {
    loading.value = false;
  }
};

const handleClose = () => {
  visible.value = false;
  router.push('/login');
};
</script>

<style scoped>
.verification-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px 0;
}

.verification-modal__icon {
  color: #409EFF;
  margin-bottom: 20px;
}

.verification-modal__text {
  font-size: 16px;
  margin-bottom: 15px;
  line-height: 1.5;
}

.verification-modal__subtext {
  font-size: 14px;
  color: #606266;
  margin-bottom: 25px;
  line-height: 1.4;
}

.verification-modal__actions {
  display: flex;
  gap: 15px;
}
</style>