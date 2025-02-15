<template>
  <TheHeader></TheHeader>
  <div class="home-page">
    <div class="hero-section">
      <div class="hero-content">
        <h1>Хакатон</h1>
        <p>Цифровые двойники в энергетике</p>
        <el-button type="primary" class="custom-button" @click="handleApplicationClick">Подать заявку</el-button>
      </div>
    </div>

    <AuthRequiredModal v-model="showAuthModal" />
    <div class="task-section">
      <h2>Задача Хакатона</h2>
      <p>Командам необходимо создать цифровую модель энергетической системы месторождения и предложить оптимальные
        алгоритмы управления источниками выработки энергии, минимизирующие ее себестоимость, как тепловой, так и
        электрической.</p>
      <p>Схема энергоснабжения месторождения может быть комбинированной, включающая в себя разновидности генерирующих
        установок на газовом топливе, других видах топлива, а также внешние сети и источники питания.</p>
    </div>

    <div class="stages-section">
      <h2>Этапы</h2>
      <div class="stages-container">
        <div class="stage-item">
          <div class="stage-number">1</div>
          <el-icon>
            <UserFilled/>
          </el-icon>
          <span>Регистрация участников</span>
        </div>
        <div class="stage-item">
          <div class="stage-number">2</div>
          <el-icon>
            <Document/>
          </el-icon>
          <span>Рассылка данных для выполнения задания</span>
        </div>
        <div class="stage-item">
          <div class="stage-number">3</div>
          <el-icon>
            <Monitor/>
          </el-icon>
          <span>Прием решений</span>
        </div>
        <div class="stage-item">
          <div class="stage-number">4</div>
          <el-icon>
            <Check/>
          </el-icon>
          <span>Проверка решений</span>
        </div>
        <div class="stage-item">
          <div class="stage-number">5</div>
          <el-icon>
            <Trophy/>
          </el-icon>
          <span>Онлайн защита</span>
        </div>
        <div class="stage-item">
          <div class="stage-number">6</div>
          <el-icon>
            <Star/>
          </el-icon>
          <span>Публикация результатов</span>
        </div>
        <div class="stage-item">
          <div class="stage-number">7</div>
          <el-icon>
            <Medal/>
          </el-icon>
          <span>Награждение</span>
        </div>
      </div>
    </div>
  </div>
  <TheFooter></TheFooter>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {UserFilled, Document, Monitor, Check, Trophy, Star, Medal} from '@element-plus/icons-vue'
import TheHeader from "@/components/TheHeader.vue";
import TheFooter from "@/components/TheFooter.vue";
import AuthRequiredModal from "@/components/auth/AuthRequiredModal.vue";

const router = useRouter();
const showAuthModal = ref(false);

const handleApplicationClick = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    showAuthModal.value = true;
  } else {
    router.push('/team/apply');
  }
};

const navigateToLogin = () => {
  showAuthModal.value = false;
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
}

.home-page {
  min-height: 100vh;
  margin-top: 105px;
}

.custom-button {
  padding: 12px 30px;
  font-size: 18px;
  border-radius: 8px;
  background: linear-gradient(90deg, #00A3FF 0%, #5B51D8 100%);
  border: none;
  transition: opacity 0.3s ease;
}

.custom-button:hover {
  opacity: 0.8;
}

.hero-section {
  height: 600px;
  background-image: url('../assets/img/img.png');
  background-size: cover;
  background-position: center;
  position: relative;
  border-radius: 16px;
  margin: 20px;
  display: flex;
  align-items: center;
  padding-left: 60px;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 16px;
}

.hero-content {
  position: relative;
  z-index: 1;
  color: white;
  max-width: 600px;
}

.hero-content h1 {
  font-size: 48px;
  margin-bottom: 20px;
  font-weight: bold;
}

.hero-content p {
  font-size: 24px;
  margin-bottom: 30px;
}

.custom-button {
  padding: 12px 30px;
  font-size: 18px;
  border-radius: 8px;
  background: linear-gradient(90deg, #00A3FF 0%, #5B51D8 100%);
  border: none;
}

.task-section {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.task-section h2 {
  font-size: 32px;
  margin-bottom: 20px;
  color: #333;
  font-weight: bold;
}

.task-section p {
  font-size: 16px;
  line-height: 1.6;
  color: #666;
  margin-bottom: 15px;
}

.stages-section {
  background: linear-gradient(90deg, #00A3FF 0%, #5B51D8 100%);
  padding: 40px 20px;
  color: white;
  border-radius: 16px;
  margin: 20px;
}

.stages-container {
  max-width: 800px;
  margin: 0 auto;
}

.stage-item {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  position: relative;
}

.stage-number {
  background: rgba(255, 255, 255, 0.2);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
}

.stage-item .el-icon {
  font-size: 24px;
}

.stages-section h2 {
  text-align: center;
  margin-bottom: 30px;
  font-size: 32px;
  font-weight: bold;
}
</style>