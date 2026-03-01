<template>
  <TheHeader/>
  <div class="login-wrapper">
    <div class="login-card">
      <h1 class="login-title">Вход</h1>
      <p class="login-subtitle">Войдите в свой аккаунт</p>
      <AuthForm
          :loading="loading"
          :fields="loginFields"
          submit-button-text="Войти"
          submit-loading-text="Вход..."
          secondary-button-text="Зарегистрироваться"
          @submit="submitLogin"
          @secondary-action="moveToRegister"
          class="login-form"
      />
      <div class="register-link-section">
        <span class="register-link-text">Нет аккаунта?</span>
        <el-button
            type="primary"
            link
            @click="moveToRegister"
            class="register-link-button"
        >
          Зарегистрироваться
        </el-button>
      </div>
      <div class="help-links-section">
        <el-button
            type="primary"
            link
            @click="handleForgotPassword"
            class="help-link"
        >
          Забыли пароль?
        </el-button>
        <el-button
            type="primary"
            link
            :loading="resendLoading"
            @click="handleResendEmail"
            class="help-link"
        >
          Не получили письмо для подтверждения?
        </el-button>
      </div>
    </div>
  </div>
  <el-dialog
      v-model="showEmailDialog"
      :width="isMobile ? '100%' : '30%'"
      :fullscreen="isMobile"
      :close-on-click-modal="false"
      class="clean-dialog"
  >
    <template #header>
      <h3 class="dialog-title">Повторная отправка письма</h3>
    </template>
    <el-form :model="emailForm" ref="emailFormRef" :rules="emailRules" class="dialog-form">
      <el-form-item prop="email" class="dialog-form-item">
        <label class="dialog-label">Email</label>
        <el-input 
            v-model="emailForm.email" 
            placeholder="Введите ваш email"
            class="dialog-input"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="showEmailDialog = false" class="dialog-btn-secondary">
          Отмена
        </el-button>
        <el-button type="primary" @click="submitResendEmail" :loading="resendLoading" class="dialog-btn-primary">
          Отправить
        </el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog
      v-model="showForgotPasswordDialog"
      :width="isMobile ? '100%' : '30%'"
      :fullscreen="isMobile"
      :close-on-click-modal="false"
      class="clean-dialog"
  >
    <template #header>
      <h3 class="dialog-title">Восстановление пароля</h3>
    </template>
    <el-form :model="forgotPasswordForm" ref="forgotPasswordFormRef" :rules="emailRules" class="dialog-form">
      <el-form-item prop="email" class="dialog-form-item">
        <label class="dialog-label">Email</label>
        <el-input 
            v-model="forgotPasswordForm.email" 
            placeholder="Введите ваш email"
            class="dialog-input"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="showForgotPasswordDialog = false" class="dialog-btn-secondary">
          Отмена
        </el-button>
        <el-button type="primary" @click="submitForgotPassword" :loading="forgotPasswordLoading" class="dialog-btn-primary">
          Отправить
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import {onUnmounted, ref} from 'vue';
import {ElMessage} from 'element-plus';
import {Message, Lock} from '@element-plus/icons-vue';
import AuthForm from '../components/auth/AuthForm.vue';
import {useRouter} from 'vue-router';
import {authApi} from '../api/auth';
import TheHeader from "@/components/TheHeader.vue";

const router = useRouter();
const loading = ref(false);
const resendLoading = ref(false);
const showEmailDialog = ref(false);
const emailFormRef = ref(null);
const showForgotPasswordDialog = ref(false);
const forgotPasswordLoading = ref(false);
const forgotPasswordFormRef = ref(null);

const isMobile = ref(window.innerWidth <= 768);

const handleResize = () => {
  isMobile.value = window.innerWidth <= 768;
};

const emailForm = ref({
  email: ''
});

const forgotPasswordForm = ref({
  email: ''
});
const emailRules = {
  email: [
    {required: true, message: 'Пожалуйста, введите email', trigger: 'blur'},
    {type: 'email', message: 'Пожалуйста, введите корректный email', trigger: ['blur', 'change']}
  ]
};

const loginFields = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Введите email',
    rules: [
      {required: true, message: 'Пожалуйста, введите почту', trigger: 'blur'},
      {type: 'email', message: 'Почта введена некорректно', trigger: ['blur', 'change']}
    ]
  },
  {
    name: 'password',
    label: 'Пароль',
    type: 'password',
    placeholder: 'Введите пароль',
    rules: [
      {required: true, message: 'Пожалуйста, введите пароль', trigger: 'blur'},
    ]
  }
];

const submitLogin = async (formData) => {
  try {
    loading.value = true;
    await authApi.login(formData.email, formData.password);
    ElMessage.success('Вход выполнен успешно!');
    await router.push('/');
  } catch (error) {
    console.error('Ошибка при входе:', error);
    ElMessage.error(error?.detail || 'Ошибка при попытке входа в систему');
  } finally {
    loading.value = false;
  }
};

const handleResendEmail = () => {
  showEmailDialog.value = true;
};

const submitResendEmail = async () => {
  if (!emailFormRef.value) return;

  try {
    await emailFormRef.value.validate();
    resendLoading.value = true;
    const response = await authApi.resendVerificationEmail(emailForm.value.email);
    ElMessage.success("Если указанный email зарегистрирован в системе, на него будет отправлено письмо с подтверждением");
    showEmailDialog.value = false;
    emailForm.value.email = '';
  } catch (error) {
    console.error('Ошибка при отправке письма:', error);
    ElMessage.error(error?.detail || 'Ошибка при отправке письма');
  } finally {
    resendLoading.value = false;
  }
};

const moveToRegister = () => {
  router.push('/registration');
};

const handleForgotPassword = () => {
  showForgotPasswordDialog.value = true;
};

const submitForgotPassword = async () => {
  if (!forgotPasswordFormRef.value) return;

  try {
    await forgotPasswordFormRef.value.validate();
    forgotPasswordLoading.value = true;
    await authApi.forgotPassword(forgotPasswordForm.value.email);
    ElMessage.success("Если указанный email зарегистрирован в системе, на него будет отправлено письмо с инструкциями по восстановлению пароля");
    showForgotPasswordDialog.value = false;
    forgotPasswordForm.value.email = '';
  } catch (error) {
    console.error('Ошибка при отправке письма:', error);
    ElMessage.error(error?.detail || 'Ошибка при отправке письма');
  } finally {
    forgotPasswordLoading.value = false;
  }
};

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.login-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 64px); /* Минус высота хедера */
  width: 100%;
  background-color: #f8fafc; /* bg-slate-50 */
  padding: 20px;
  margin-top: 64px; /* Отступ под хедер */
}

.login-card {
  background: white; /* bg-white */
  width: 100%;
  max-width: 28rem; /* max-w-md */
  padding: 32px; /* p-8 */
  border-radius: 12px; /* rounded-xl */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1); /* shadow-lg */
  border: 1px solid #e2e8f0; /* border border-slate-200 */
}

.login-title {
  font-size: 1.5rem; /* text-2xl */
  font-weight: 700; /* font-bold */
  color: #0f172a; /* text-slate-900 */
  margin: 0 0 8px 0; /* mb-2 */
  text-align: center;
}

.login-subtitle {
  font-size: 0.875rem; /* text-sm */
  color: #64748b; /* text-slate-500 */
  text-align: center;
  margin: 0 0 24px 0; /* mb-6 */
}

.login-form {
  text-align: left;
}

/* Override Element Plus form layout for stacked labels */
.login-form :deep(.el-form) {
  --el-form-label-width: 0;
}

.login-form :deep(.el-form-item) {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

/* Labels above inputs */
.login-form :deep(.el-form-item__label) {
  display: block;
  font-size: 0.875rem; /* text-sm */
  font-weight: 500; /* font-medium */
  color: #334155; /* text-slate-700 */
  margin-bottom: 6px; /* mb-1.5 */
  padding: 0;
  line-height: 1.5;
  width: 100% !important;
  text-align: left;
  position: relative;
  float: none;
}

.login-form :deep(.el-form-item__label::before) {
  display: none; /* Убираем красную звездочку, если она есть */
}

.login-form :deep(.el-form-item__content) {
  margin-left: 0 !important;
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* Modern input styling */
.login-form :deep(.el-input__wrapper) {
  width: 100%;
  padding: 8px 12px; /* px-3 py-2 */
  border: 1px solid #cbd5e1; /* border-slate-300 */
  border-radius: 8px; /* rounded-lg */
  transition: all 0.2s ease;
  box-shadow: none;
}

.login-form :deep(.el-input__wrapper:hover) {
  border-color: #94a3b8; /* hover:border-slate-400 */
}

.login-form :deep(.el-input.is-focus .el-input__wrapper) {
  border-color: #2563eb; /* focus:border-blue-500 */
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); /* focus:ring-2 focus:ring-blue-500 */
}

.login-form :deep(.el-input__inner) {
  padding: 0;
  font-size: 0.875rem;
}

.login-form :deep(.el-form-item__error) {
  position: absolute;
  top: 100%;
  left: 0;
  margin-left: 0;
  margin-top: 4px;
  color: var(--el-color-danger);
  font-size: 0.75rem;
  line-height: 1;
}

/* Primary button - full width */
.login-form :deep(.button-container) {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-top: 24px;
  gap: 0;
}

.login-form :deep(.button-confirm) {
  width: 100% !important;
  background: #2563eb; /* bg-blue-600 */
  color: white;
  font-weight: 500; /* font-medium */
  padding: 10px 16px; /* py-2.5 */
  border-radius: 8px; /* rounded-lg */
  border: none;
  transition: background-color 0.2s ease;
}

.login-form :deep(.button-confirm:hover) {
  background: #1d4ed8; /* hover:bg-blue-700 */
}

.login-form :deep(.button-confirm:not(:disabled)) {
  background: #2563eb;
}

.login-form :deep(.button-confirm:not(:disabled):hover) {
  background: #1d4ed8;
}

/* Hide secondary button (we'll use text link instead) */
.login-form :deep(.button-secondary) {
  display: none;
}

/* Register link section */
.register-link-section {
  text-align: center;
  margin-top: 24px; /* mt-6 */
  font-size: 0.875rem; /* text-sm */
  color: #475569; /* text-slate-600 */
}

.register-link-text {
  margin-right: 4px;
}

.register-link-button {
  padding: 0;
  font-size: 0.875rem;
  color: #2563eb; /* text-blue-600 */
  text-decoration: none;
}

.register-link-button:hover {
  text-decoration: underline;
}

/* Help links section */
.help-links-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.help-link {
  padding: 0;
  font-size: 0.875rem; /* text-sm */
  color: #2563eb; /* text-blue-600 */
  text-decoration: none;
  height: auto;
}

.help-link:hover {
  text-decoration: underline;
}

/* Dialog specific styles */
.clean-dialog :deep(.el-dialog__header) {
  padding: 24px 24px 16px 24px;
  border-bottom: 1px solid #e2e8f0;
}

.dialog-title {
  font-size: 1.25rem; /* text-xl */
  font-weight: 700; /* font-bold */
  color: #0f172a; /* text-slate-900 */
  margin: 0;
  text-align: left;
}

.dialog-form {
  width: 100%;
}

.dialog-form-item {
  display: flex;
  flex-direction: column;
  gap: 6px; /* gap-1 */
  margin-bottom: 0;
}

.dialog-form-item :deep(.el-form-item__content) {
  margin-left: 0 !important;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.dialog-label {
  display: block;
  font-size: 0.875rem; /* text-sm */
  font-weight: 500; /* font-medium */
  color: #334155; /* text-slate-700 */
  margin-bottom: 0;
}

.dialog-input {
  width: 100%;
}

.dialog-input :deep(.el-input__wrapper) {
  width: 100%;
  padding: 8px 12px; /* px-3 py-2 */
  border: 1px solid #cbd5e1; /* border-slate-300 */
  border-radius: 8px; /* rounded-lg */
  box-shadow: none;
}

.dialog-input :deep(.el-input__wrapper:hover) {
  border-color: #94a3b8;
}

.dialog-input :deep(.el-input.is-focus .el-input__wrapper) {
  border-color: #2563eb; /* focus:border-blue-500 */
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); /* focus:ring-2 focus:ring-blue-500 */
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  width: 100%;
}

.dialog-btn-primary {
  background: #2563eb !important; /* bg-blue-600 */
  color: white !important;
  border-color: #2563eb !important;
  padding: 10px 16px !important; /* px-4 py-2 */
  border-radius: 8px !important; /* rounded-lg */
  font-weight: 500;
}

.dialog-btn-primary:hover {
  background: #1d4ed8 !important;
  border-color: #1d4ed8 !important;
}

.dialog-btn-secondary {
  background: white !important;
  color: #475569 !important; /* text-slate-600 */
  border-color: #cbd5e1 !important;
  padding: 10px 16px !important; /* px-4 py-2 */
  border-radius: 8px !important; /* rounded-lg */
  font-weight: 500;
}

.dialog-btn-secondary:hover {
  background: #f8fafc !important; /* hover:bg-slate-100 */
  color: #334155 !important;
  border-color: #94a3b8 !important;
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

/* Form styles in dialogs */
:deep(.el-dialog .el-form-item__label) {
  display: block;
  font-size: 0.875rem; /* text-sm */
  font-weight: 500; /* font-medium */
  color: #334155; /* text-slate-700 */
  margin-bottom: 6px; /* mb-1.5 */
  padding: 0;
}

:deep(.el-dialog .el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-dialog .el-input__wrapper) {
  padding: 8px 12px; /* px-3 py-2 */
  border: 1px solid #cbd5e1; /* border-slate-300 */
  border-radius: 8px; /* rounded-lg */
  transition: all 0.2s ease;
  box-shadow: none;
}

:deep(.el-dialog .el-input__wrapper:hover) {
  border-color: #94a3b8; /* hover:border-slate-400 */
}

:deep(.el-dialog .el-input.is-focus .el-input__wrapper) {
  border-color: #2563eb; /* focus:border-blue-500 */
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); /* focus:ring-2 */
}

/* Buttons in dialogs */
:deep(.el-dialog .el-button) {
  border-radius: 8px; /* rounded-lg */
  font-weight: 500; /* font-medium */
  padding: 10px 16px; /* py-2.5 px-4 */
  transition: all 0.2s ease;
}

:deep(.el-dialog .el-button--primary) {
  background: #2563eb; /* bg-blue-600 */
  border-color: #2563eb;
  color: white;
}

:deep(.el-dialog .el-button--primary:hover) {
  background: #1d4ed8; /* hover:bg-blue-700 */
  border-color: #1d4ed8;
}

:deep(.el-dialog .el-button:not(.el-button--primary)) {
  background: white;
  border-color: #cbd5e1; /* border-slate-300 */
  color: #475569; /* text-slate-600 */
}

:deep(.el-dialog .el-button:not(.el-button--primary):hover) {
  background: #f8fafc; /* hover:bg-slate-50 */
  border-color: #94a3b8; /* hover:border-slate-400 */
  color: #334155; /* hover:text-slate-700 */
}

@media (max-width: 768px) {
  .login-wrapper {
    padding: 16px;
    margin-top: 64px;
  }

  .login-card {
    padding: 24px;
    max-width: 100%;
  }

  :deep(.el-dialog) {
    margin: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
    height: 100% !important;
    border-radius: 0 !important;
  }

  :deep(.el-dialog__header) {
    padding: 20px !important;
    margin: 0 !important;
    border-bottom: 1px solid #e2e8f0; /* border-slate-200 */
  }

  :deep(.el-dialog__body) {
    padding: 20px !important;
    height: calc(100% - 120px) !important;
    overflow-y: auto;
  }

  :deep(.el-dialog__footer) {
    padding: 20px !important;
    border-top: 1px solid #e2e8f0; /* border-slate-200 */
  }

  .dialog-footer {
    flex-direction: column;
    gap: 10px;
    width: 100%;
  }

  .dialog-footer .el-button {
    width: 100%;
    margin: 0 !important;
  }

  :deep(.el-overlay) {
    background-color: white !important;
  }
}
</style>