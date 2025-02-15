<template>
  <PrimaryLayout>
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
      </div>
    </div>
  </PrimaryLayout>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import PrimaryLayout from '../components/PrimaryLayout.vue';
import AuthForm from '../components/auth/AuthForm.vue';
import { useRouter } from 'vue-router';
import { authApi } from '../api/auth';

const router = useRouter();
const loading = ref(false);

const loginFields = [
  {
    name: 'email',
    label: 'Email:',
    type: 'email',
    placeholder: 'Введите email',
    rules: [
    { required: true, message: 'Пожалуйста, введите почту', trigger: 'blur' },
    { type: 'email', message: 'Почта введена некорректно', trigger: ['blur', 'change'] }
    ]
  },
  {
    name: 'password',
    label: 'Пароль:',
    type: 'password',
    placeholder: 'Введите пароль',
    rules: [
    { required: true, message: 'Пожалуйста, введите пароль', trigger: 'blur' },
    ]
  }
];
const submitLogin = async (formData) => {
  try {
    loading.value = true;
    await authApi.login(formData.email, formData.password);
    const userData = await authApi.getCurrentUser();
    ElMessage.success('Вход выполнен успешно!');
    router.push('/');
  } catch (error) {
    console.error('Ошибка при входе:', error);
    ElMessage.error(error?.detail || 'Ошибка при попытке входа в систему');
  } finally {
    loading.value = false;
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
  min-height: calc(100vh - 338px);
}

.wrapper__main-container {
  color: black;
  margin: 0 auto;
  padding: 30px;
  box-shadow: 1px 2px 2px 3px rgba(0, 0, 0, 0.2);

  min-width: 40vh;
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

@media (max-width: 768px) {
  .wrapper__main-container {
    width: 90%;
    padding: 20px;
    margin: 10px;
  }
}
</style>