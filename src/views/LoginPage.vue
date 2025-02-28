<template>
  <TheHeader/>
    <div class="wrapper">
      <div class="wrapper__main-container">
        <h1 class="main-container-name">Вход</h1>
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
        <div class="resend-email-section">
          <p class="resend-text">Не получили письмо для подтверждения?</p>
          <el-button
              type="primary"
              link
              :loading="resendLoading"
              @click="handleResendEmail"
          >
            Отправить повторно
          </el-button>
        </div>
      </div>
    </div>
    <el-dialog
        v-model="showEmailDialog"
        title="Повторная отправка письма"
        width="30%"
        :close-on-click-modal="false"
    >
      <el-form :model="emailForm" ref="emailFormRef" :rules="emailRules">
        <el-form-item prop="email" label="Email">
          <el-input v-model="emailForm.email" placeholder="Введите ваш email"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showEmailDialog = false">Отмена</el-button>
          <el-button type="primary" @click="submitResendEmail" :loading="resendLoading">
            Отправить
          </el-button>
        </span>
      </template>
    </el-dialog>
</template>

<script setup>
import {ref} from 'vue';
import {ElMessage} from 'element-plus';
import AuthForm from '../components/auth/AuthForm.vue';
import {useRouter} from 'vue-router';
import {authApi} from '../api/auth';
import TheHeader from "@/components/TheHeader.vue";

const router = useRouter();
const loading = ref(false);
const resendLoading = ref(false);
const showEmailDialog = ref(false);
const emailFormRef = ref(null);

const emailForm = ref({
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
    label: 'Email:',
    type: 'email',
    placeholder: 'Введите email',
    rules: [
      {required: true, message: 'Пожалуйста, введите почту', trigger: 'blur'},
      {type: 'email', message: 'Почта введена некорректно', trigger: ['blur', 'change']}
    ]
  },
  {
    name: 'password',
    label: 'Пароль:',
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
    if (response.message){
      ElMessage.success(response.message);
    } else {
      ElMessage.success("Если указанный email зарегистрирован в системе, на него будет отправлено письмо с подтверждением");
    }
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
</script>

<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px 0;
}

.wrapper__main-container {
  color: black;
  margin: 0 auto;
  padding: 30px;
  box-shadow: 1px 2px 2px 3px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 450px;
  text-align: center;
  border-radius: 8px;
  background: white;
}

.main-container-name {
  padding-bottom: 20px;
  font-size: 24px;
  color: #409EFF;
  font-weight: bold;
}

.login-form {
  text-align: left;
}

.login-form :deep(.el-form-item__error) {
  position: absolute;
  top: 100%;
  left: 0;
  margin-left: 0;
  color: var(--el-color-danger);
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
}

.login-form :deep(.el-form-item) {
  margin-bottom: 20px;
}

.login-form :deep(.el-form-item:last-child) {
  margin-bottom: 17px;
  margin-top: 30px;
}

.login-form :deep(.el-input) {
  width: 100%;
}

.login-form :deep(.el-form-item__label) {
  padding-bottom: 8px;
}

.resend-email-section {
  margin-top: 20px;
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.resend-text {
  color: #606266;
  font-size: 14px;
  margin-bottom: 8px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@media (max-width: 768px) {
  .wrapper__main-container {
    width: 90%;
    padding: 20px;
    margin: 10px;
  }

  :deep(.el-dialog) {
    width: 90% !important;
    margin: 10px auto !important;
  }

  :deep(.el-button) {
    margin-left: 0 !important;
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

  .dialog-footer {
    flex-direction: column;
    gap: 10px;
  }

  .dialog-footer .el-button {
    width: 100%;
  }

  :deep(.el-form-item__label) {
    float: none;
    display: block;
    text-align: left;
    padding-bottom: 8px;
  }
}
</style>