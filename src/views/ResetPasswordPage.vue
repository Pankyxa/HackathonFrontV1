<template>
  <TheHeader/>
  <div class="wrapper">
    <div class="wrapper__main-container">
      <h1 class="main-container-name">Восстановление пароля</h1>
      <el-form
          :model="resetForm"
          ref="resetFormRef"
          :rules="resetRules"
          label-width="120px"
          class="reset-form"
      >
        <el-form-item prop="password" label="Новый пароль:">
          <el-input
              v-model="resetForm.password"
              type="password"
              placeholder="Введите новый пароль"
              show-password
          />
        </el-form-item>
        <el-form-item prop="confirmPassword" label="Подтверждение:">
          <el-input
              v-model="resetForm.confirmPassword"
              type="password"
              placeholder="Повторите новый пароль"
              show-password
          />
        </el-form-item>
        <div class="button-container">
          <el-button
              type="primary"
              :loading="loading"
              @click="submitReset"
              class="button-confirm"
          >
            {{ loading ? 'Сброс пароля...' : 'Сбросить пароль' }}
          </el-button>
          <el-button
              @click="moveToLogin"
              class="button-secondary"
          >
            Отмена
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { authApi } from '../api/auth';
import TheHeader from '@/components/TheHeader.vue';

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const resetFormRef = ref(null);

const resetForm = ref({
  password: '',
  confirmPassword: ''
});

const validatePassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error('Пожалуйста, введите пароль'));
  } else if (value.length < 6) {
    callback(new Error('Пароль должен содержать минимум 6 символов'));
  } else {
    callback();
  }
};

const validateConfirmPassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error('Пожалуйста, подтвердите пароль'));
  } else if (value !== resetForm.value.password) {
    callback(new Error('Пароли не совпадают'));
  } else {
    callback();
  }
};

const resetRules = {
  password: [
    { validator: validatePassword, trigger: 'blur' }
  ],
  confirmPassword: [
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
};

const submitReset = async () => {
  if (!resetFormRef.value) return;

  try {
    await resetFormRef.value.validate();
    loading.value = true;
    const token = route.params.token;
    await authApi.resetPassword(token, resetForm.value.password);
    ElMessage.success('Пароль успешно изменен!');
    setTimeout(() => {
      router.push('/login');
    }, 1500);
  } catch (error) {
    console.error('Ошибка при сбросе пароля:', error);
    ElMessage.error(error?.detail || 'Ошибка при сбросе пароля. Возможно, ссылка устарела.');
  } finally {
    loading.value = false;
  }
};

const moveToLogin = () => {
  router.push('/login');
};

onMounted(() => {
  if (!route.params.token) {
    ElMessage.error('Неверная ссылка для восстановления пароля');
    router.push('/login');
  }
});
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

.reset-form {
  text-align: left;
}

.reset-form :deep(.el-form-item__error) {
  position: absolute;
  top: 100%;
  left: 0;
  margin-left: 0;
  color: var(--el-color-danger);
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
}

.reset-form :deep(.el-form-item) {
  margin-bottom: 20px;
}

.reset-form :deep(.el-form-item:last-of-type) {
  margin-bottom: 17px;
  margin-top: 30px;
}

.reset-form :deep(.el-input) {
  width: 100%;
}

.reset-form :deep(.el-form-item__label) {
  padding-bottom: 8px;
}

.button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  gap: 5px;
  background: white;
  padding: 10px 0;
  flex-shrink: 0;
}

.button-container :deep(.el-button) {
  margin: 0 !important;
  width: 200px;
}

@media (max-width: 768px) {
  .wrapper__main-container {
    width: 90%;
    padding: 20px;
    margin: 10px;
  }
}
</style>
