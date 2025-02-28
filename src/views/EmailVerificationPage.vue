<template>
  <PrimaryLayout>
    <div class="verification-wrapper">
      <div class="verification-container">
        <h2 class="verification-title">Подтверждение email</h2>
        
        <div v-if="loading" class="verification-status">
          <el-icon class="loading-icon"><Loading /></el-icon>
          <p>Подтверждаем ваш email...</p>
        </div>

        <div v-else-if="error" class="verification-status error">
          <el-icon class="error-icon"><CircleCloseFilled /></el-icon>
          <p>{{ error }}</p>
          <el-button type="primary" @click="handleReturnToLogin">
            Вернуться на страницу входа
          </el-button>
        </div>
      </div>
    </div>
  </PrimaryLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Loading, CircleCloseFilled } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import PrimaryLayout from '../components/PrimaryLayout.vue';
import { authApi } from '../api/auth';

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const error = ref(null);

const verifyEmail = async (token) => {
  try {
    const response = await authApi.verifyEmail(token);
    ElMessage.success('Email успешно подтвержден');
    router.push('/login');
  } catch (err) {
    error.value = err?.detail || 'Произошла ошибка при подтверждении email';
    loading.value = false;
  }
};

const handleReturnToLogin = () => {
  router.push('/login');
};

onMounted(() => {
  const token = route.params.token;
  if (token) {
    verifyEmail(token);
  } else {
    error.value = 'Токен подтверждения не найден';
    loading.value = false;
  }
});
</script>

<style scoped>
.verification-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 338px);
  padding: 20px;
}

.verification-container {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 1px 2px 2px 3px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 100%;
  text-align: center;
}

.verification-title {
  color: #409EFF;
  margin-bottom: 30px;
  font-size: 24px;
}

.verification-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.loading-icon {
  font-size: 40px;
  color: #409EFF;
  animation: rotate 1s linear infinite;
}

.error-icon {
  font-size: 40px;
  color: #F56C6C;
}

.verification-status p {
  font-size: 16px;
  line-height: 1.5;
  margin: 0;
}

.error {
  color: #F56C6C;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>