<template>
  <TheHeader :class="{ 'header-hidden': isHeaderHidden }"></TheHeader>
  <div class="home-page">
    <div class="hero-section">
      <div class="hero-content">
        <h1>Хакатон</h1>
        <p>Цифровые двойники в энергетике</p>
        <p class="subtitle">Командные соревнования по решению производственной задачи</p>
        <div class="prize-info">Призовой фонд 225 000 рублей</div>
        <el-button type="primary" class="custom-button" @click="handleApplicationClick">Подать заявку</el-button>
      </div>
    </div>

    <AuthRequiredModal v-model="showAuthModal"/>
    <div class="info-section">
      <div class="info-cards">
        <div class="info-card">
          <el-icon>
            <User/>
          </el-icon>
          <h3>100</h3>
          <p>участников</p>
        </div>
        <div class="info-card">
          <el-icon>
            <UserFilled/>
          </el-icon>
          <h3>20</h3>
          <p>команд</p>
        </div>
        <div class="info-card">
          <el-icon>
            <Monitor/>
          </el-icon>
          <h3>Онлайн</h3>
          <p>формат участия</p>
        </div>
      </div>
    </div>
    <div class="task-section">
      <h2>О соревнованиях</h2>
      <p>Командам необходимо создать цифровую модель энергетической системы месторождения и предложить оптимальный
        алгоритм управления источниками выработки энергии. Текст задания доступен зарегистрированным командам.</p>
      <p>Участниками могут стать студенты вузов, колледжей и техникумов экосистемы ПАО «Газпром нефть» направления
        тепло- и электроэнергетики и других. Подробнее смотрите в Положении.</p>
    </div>

    <div class="timeline-section">
      <h2>Таймлайн</h2>
      <div class="timeline-container">
        <div class="timeline-item">
          <div class="date">С 1 марта</div>
          <div class="event">Доступ к тексту задания</div>
        </div>
        <div class="timeline-item">
          <div class="date">C 1 марта до 1 апреля</div>
          <div class="event">Регистрация на сайте</div>
          <div class="note">(регистрация может закончиться раньше)</div>
        </div>
        <div class="timeline-item">
          <div class="date">09 апреля</div>
          <div class="event">Онлайн открытие Хакатона</div>
          <div class="note">Время будет уточнено</div>
        </div>
        <div class="timeline-item">
          <div class="date">09 апреля</div>
          <div class="event">Доступ к данным для решения задачи</div>
          <div class="note">Время будет уточнено</div>
        </div>
        <div class="timeline-item">
          <div class="date">10 апреля</div>
          <div class="event">Дедлайн загрузки решений</div>
          <div class="note">Через 24 часа после старта (время будет уточнено)</div>
        </div>
      </div>
    </div>

    <div class="stages-section">
      <h2>Этапы</h2>
      <div class="stages-container">
        <div class="stage-item" v-for="(stage, index) in stages" :key="index">
          <div class="stage-number">{{ index + 1 }}</div>
          <el-icon>
            <component :is="stage.icon"/>
          </el-icon>
          <span>{{ stage.text }}</span>
        </div>
      </div>
    </div>
  </div>
  <TheFooter></TheFooter>
</template>

<script setup>
import {ref, onMounted, onUnmounted} from 'vue';
import {useRouter} from 'vue-router';
import {UserFilled, Document, Monitor, Check, Trophy, Star, Medal, User} from '@element-plus/icons-vue'
import TheHeader from "@/components/TheHeader.vue";
import TheFooter from "@/components/TheFooter.vue";
import AuthRequiredModal from "@/components/auth/AuthRequiredModal.vue";

const router = useRouter();
const showAuthModal = ref(false);
const isHeaderHidden = ref(false);
const lastScrollPosition = ref(0);
const scrollThreshold = 100;

const handleScroll = () => {
  const currentScrollPosition = window.scrollY;

  if (Math.abs(currentScrollPosition - lastScrollPosition.value) < scrollThreshold) {
    return;
  }

  isHeaderHidden.value = currentScrollPosition > lastScrollPosition.value && currentScrollPosition > 100;
  lastScrollPosition.value = currentScrollPosition;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const stages = [
  {icon: UserFilled, text: 'Регистрация участников'},
  {icon: Document, text: 'Рассылка данных для выполнения задания'},
  {icon: Monitor, text: 'Прием решений'},
  {icon: Check, text: 'Проверка решений'},
  {icon: Trophy, text: 'Онлайн защита'},
  {icon: Star, text: 'Публикация результатов'},
  {icon: Medal, text: 'Награждение'}
];

const handleApplicationClick = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    showAuthModal.value = true;
  } else {
    router.push('/team/apply');
  }
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

.subtitle {
  font-size: 20px;
  margin-bottom: 15px;
}

.prize-info {
  font-size: 24px;
  color: #FFD700;
  margin-bottom: 30px;
  font-weight: bold;
}

.info-section {
  padding: 40px 20px;
}

.info-cards {
  display: flex;
  justify-content: center;
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.info-card {
  background: white;
  padding: 30px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  flex: 1;
  max-width: 250px;
}

.info-card .el-icon {
  font-size: 40px;
  color: #00A3FF;
  margin-bottom: 15px;
}

.info-card h3 {
  font-size: 32px;
  margin: 10px 0;
  color: #333;
}

.info-card p {
  color: #666;
}

.timeline-section {
  padding: 40px 20px;
  background: #f8f9fa;
  border-radius: 16px;
  margin: 20px;
}

.timeline-section h2 {
  text-align: center;
  margin-bottom: 40px;
  font-size: 32px;
  font-weight: bold;
  color: #333333;
}

.timeline-container {
  max-width: 800px;
  margin: 0 auto;
}

.timeline-item {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.timeline-item .date {
  font-weight: bold;
  color: #00A3FF;
  margin-bottom: 5px;
}

.timeline-item .event {
  font-size: 18px;
  margin-bottom: 5px;
  color: #333333;
}

.timeline-item .note {
  font-size: 14px;
  color: #666;
  font-style: italic;
}

:deep(.header-hidden) {
  transform: translateY(-100%);
}

@media (max-width: 768px) {
  .hero-section {
    height: 400px;
    padding: 20px;
    margin: 10px;
  }

  .hero-content {
    max-width: 100%;
    text-align: center;
    padding: 0 20px;
  }

  .hero-content h1 {
    font-size: 36px;
  }

  .hero-content p {
    font-size: 18px;
  }

  .custom-button {
    padding: 10px 20px;
    font-size: 16px;
  }

  .info-cards {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .info-card {
    width: 100%;
    max-width: none;
  }

  .task-section {
    padding: 30px 15px;
  }

  .task-section h2 {
    font-size: 24px;
  }

  .task-section p {
    font-size: 14px;
  }

  .stages-section {
    margin: 10px;
    padding: 30px 15px;
  }

  .stages-section h2 {
    font-size: 24px;
  }

  .stage-item {
    padding: 15px;
  }

  .timeline-section {
    margin: 10px;
    padding: 30px 15px;
  }

  .timeline-section h2 {
    font-size: 24px;
  }

  .timeline-item {
    padding: 15px;
  }

  .timeline-item .event {
    font-size: 16px;
  }

  .timeline-item .note {
    font-size: 12px;
  }

  .prize-info {
    font-size: 20px;
  }

  .subtitle {
    font-size: 16px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .hero-section {
    height: 500px;
  }

  .hero-content h1 {
    font-size: 42px;
  }

  .info-cards {
    gap: 20px;
  }

  .info-card {
    padding: 20px;
  }
}
</style>