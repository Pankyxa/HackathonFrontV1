<template>
  <TheHeader :class="{ 'header-hidden': isHeaderHidden }"></TheHeader>
  <div class="home-page">
    <div class="hero-section">
      <div class="desktop-container">
        <div class="hero-content">
          <h1>Хакатон</h1>
          <h1>Цифровые двойники в энергетике</h1>
          <p class="subtitle">Командные соревнования по решению производственной задачи</p>
          <div class="prize-info">Призовой фонд 225 000 рублей</div>
          <el-button type="primary" class="custom-button"
                     v-if="(
                         stageStore.isRegistration &&
                          !authStore.isHaveTeam &&
                          authStore.isMember &&
                          authStore.isAuthenticated)
                     || (
                         stageStore.isRegistration &&
                         !authStore.isAuthenticated
                         )"
                     @click="handleApplicationClick">
            Подать заявку
          </el-button>
        </div>
        <div class="synergy-text">
          <div>Энергетик будущего 2050</div>
          <div>СИНЕРГИЯ</div>
        </div>
      </div>

      <div class="mobile-container">
        <h1>Хакатон</h1>
        <h1>Цифровые двойники в энергетике</h1>
        <p class="subtitle">Командные соревнования по решению производственной задачи</p>
        <div class="prize-info">Призовой фонд 225 000 рублей</div>
        <el-button type="primary" class="custom-button" @click="handleApplicationClick">Подать заявку</el-button>
        <div class="synergy-text">
          <div>Энергетик будущего 2050</div>
          <div>СИНЕРГИЯ</div>
        </div>
      </div>
    </div>

    <div class="consultation-section">
      <div class="consultation-container">
        <div class="consultation-content">
          <div class="consultation-badge">Важно!</div>
          <h2>Онлайн консультация для участников</h2>
          <div class="consultation-info">
            <div class="consultation-date">3 апреля в 9:30 (МСК)</div>
            <div class="consultation-details">
              <p>На консультации мы разберем основные моменты задания, ответим на ваши вопросы и обсудим технические детали решения</p>
              <a href="https://bigbb2.tyuiu.ru/b/hyc-sjb-5lk-prq"
                 target="_blank"
                 class="consultation-link">
                <el-button type="primary" class="join-button">
                  Присоединиться к консультации
                </el-button>
              </a>
            </div>
          </div>
        </div>
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
      <p>Участниками могут стать студенты вузов, колледжей и техникумов партнеров Форсайт-сессии «Энергетик будущего
        2050. Синергия» направления тепло- и электроэнергетики и других. Подробнее смотрите в <a
            href="/files/Положение о хакатоне Цифровые двойники в энергетике.pdf"
            target="_blank" class="terms-link">Положении</a>.</p>
    </div>

    <div class="timeline-section">
      <h2>Таймлайн</h2>
      <div class="timeline-container">
        <div class="timeline-item">
          <div class="date">С 1 марта</div>
          <div class="event">Доступ к тексту задания</div>
        </div>
        <div class="timeline-item">
          <div class="date">C 1 марта до 3 апреля</div>
          <div class="event">Регистрация на сайте</div>
          <div class="note">(регистрация может закончиться раньше)</div>
        </div>
        <div class="timeline-item">
          <div class="date">9 апреля 10:00 (по МСК)</div>
          <div class="event">Онлайн открытие Хакатона</div>
        </div>
        <div class="timeline-item">
          <div class="date">9 апреля</div>
          <div class="event">Доступ к тестовым данным для решения задачи</div>
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
        <div
            v-for="(stage, index) in stages"
            :key="index"
            class="stage-item"
            :class="{
          'stage-completed': isStageCompleted(stage.order),
          'stage-current': isCurrentStage(stage.order),
          'stage-upcoming': isStageUpcoming(stage.order)
        }"
        >
          <div class="stage-number">{{ stage.order }}</div>
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
import {ref, onMounted, onUnmounted, computed} from 'vue';
import {useRouter} from 'vue-router';
import {UserFilled, Document, Monitor, Check, Trophy, Star, Medal, User, Finished} from '@element-plus/icons-vue'
import TheHeader from "@/components/TheHeader.vue";
import TheFooter from "@/components/TheFooter.vue";
import AuthRequiredModal from "@/components/auth/AuthRequiredModal.vue";
import {useStageStore} from "@/stores/stage.js";
import {useAuthStore} from "@/stores/auth.js";

const router = useRouter();
const showAuthModal = ref(false);
const isHeaderHidden = ref(false);
const lastScrollPosition = ref(0);
const scrollThreshold = 100;

const stageStore = useStageStore();
const authStore = useAuthStore();

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
  {order: 1, icon: UserFilled, text: 'Регистрация участников'},
  {order: 2, icon: Finished, text: 'Регистрация закрыта'},
  {order: 3, icon: Document, text: 'Рассылка тестовых данных для выполнения задания'},
  {order: 4, icon: Monitor, text: 'Прием решений'},
  {order: 5, icon: Check, text: 'Проверка решений'},
  {order: 6, icon: Trophy, text: 'Онлайн защита'},
  {order: 7, icon: Star, text: 'Публикация результатов'},
  {order: 8, icon: Medal, text: 'Награждение'}
];

const currentOrder = computed(() => stageStore.currentStage?.order || 0);

const isStageCompleted = (stageOrder) => stageOrder < currentOrder.value;
const isCurrentStage = (stageOrder) => stageOrder === currentOrder.value;
const isStageUpcoming = (stageOrder) => stageOrder > currentOrder.value;


const handleApplicationClick = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    showAuthModal.value = true;
  } else {
    router.push('/team/apply');
  }
};

onMounted(async () => {
  await stageStore.fetchCurrentStage();
});
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

.desktop-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 60px;
  height: 100%;
  position: relative;
  z-index: 2;
}

.desktop-container .hero-content {
  color: white;
  max-width: 600px;
}

.desktop-container .synergy-text {
  color: white;
  font-weight: bold;
  font-size: 18px;
  text-align: right;
  position: absolute;
  right: 60px;
  bottom: 40px;
  white-space: nowrap;
}

.mobile-container {
  display: none;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px 20px;
  height: 100%;
  position: relative;
  z-index: 2;
  color: white;
}

.mobile-container .synergy-text {
  color: white;
  font-weight: bold;
  font-size: 16px;
  text-align: center;
  margin-top: 30px;
}


.hero-content {
  position: relative;
  z-index: 1;
  color: white;
  max-width: 100%;
  text-align: left;
  padding: 0 20px;
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
  transition: all 0.3s ease;
}

.stage-completed {
  background: rgba(128, 128, 128, 0.2);
  color: rgba(255, 255, 255, 0.7);
}

.stage-current {
  background: rgba(76, 175, 80, 0.2);
  border: 1px solid #4CAF50;
  color: white;
}

.stage-upcoming {
  background: rgba(255, 255, 255, 0.1);
  color: white;
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
}

.stage-completed .el-icon {
  color: rgba(255, 255, 255, 0.7);
}

.stage-current .el-icon {
  color: #4CAF50;
}

.stage-upcoming .el-icon {
  color: white;
}

.stage-current::before {
  content: '•';
  position: absolute;
  left: -20px;
  color: #4CAF50;
  font-size: 24px;
}

.stage-completed .stage-number {
  background: rgba(128, 128, 128, 0.3);
}

.stage-current .stage-number {
  background: rgba(76, 175, 80, 0.3);
  border: 1px solid #4CAF50;
}

.terms-link {
  color: #409EFF;
  text-decoration: underline;
  cursor: pointer;
}

.terms-link:hover {
  color: #66b1ff;
}

.consultation-section {
  margin: 20px;
  margin-top: 20px;
}

.consultation-container {
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.consultation-content {
  position: relative;
  z-index: 2;
}

.consultation-badge {
  display: inline-block;
  background: #F44336;
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 16px;
}

.consultation-content h2 {
  color: #1976D2;
  font-size: 28px;
  margin-bottom: 16px;
  font-weight: bold;
}

.consultation-info {
  display: flex;
  gap: 40px;
  align-items: center;
}

.consultation-date {
  font-size: 24px;
  font-weight: bold;
  color: #1976D2;
  white-space: nowrap;
}

.consultation-details {
  flex: 1;
}

.consultation-details p {
  color: #37474F;
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 20px;
}

.consultation-link {
  text-decoration: none;
}

.join-button {
  background: linear-gradient(90deg, #00A3FF 0%, #5B51D8 100%);
  border: none;
  padding: 12px 30px;
  font-size: 16px;
  font-weight: 500;
  width: auto;
  min-width: 250px;
}

.join-button:hover {
  opacity: 0.9;
}

@media (max-width: 768px) {
  .consultation-section {
    margin: 10px;
    margin-top: 10px;
  }

  .consultation-container {
    padding: 20px;
  }

  .consultation-info {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }

  .consultation-content h2 {
    font-size: 24px;
  }

  .consultation-date {
    font-size: 20px;
  }

  .consultation-details p {
    font-size: 14px;
  }

  .join-button {
    width: 100%;
    min-width: unset;
    padding: 10px 20px;
    font-size: 14px;
  }

  .desktop-container {
    display: none;
  }

  .hero-section {
    min-height: 500px;
    height: auto;
    margin: 10px;
  }

  .mobile-container {
    display: flex;
    justify-content: space-between;
    min-height: 500px;
    padding: 40px 20px;
  }

  .mobile-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .mobile-container .synergy-text {
    margin-top: auto;
    padding-top: 30px;
    width: 100%;
  }

  .mobile-container h1 {
    font-size: 36px;
    margin-bottom: 20px;
  }

  .mobile-container p {
    font-size: 18px;
    margin-bottom: 15px;
  }

  .mobile-container .subtitle {
    font-size: 16px;
  }

  .mobile-container .prize-info {
    font-size: 20px;
    color: #FFD700;
    margin: 20px 0;
  }

  .mobile-container .custom-button {
    margin: 20px 0;
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

  .desktop-container .hero-content h1 {
    font-size: 42px;
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

  .synergy-text {
    position: static;
    text-align: center;
    margin-top: 20px;
  }

  .hero-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>