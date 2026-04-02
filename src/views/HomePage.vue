<template>
  <TheHeader :is-header-hidden="isHeaderHidden"></TheHeader>
  <div class="home-page">
    <div class="hero-section">
      <div class="hero-wrapper">
      <div class="desktop-container">
        <div class="hero-content">
            <h1 class="hero-title">Хакатон</h1>
            <h1 class="hero-title">Цифровые двойники в энергетике</h1>
          <p class="subtitle">Командные соревнования по решению производственной задачи</p>
            <div class="prize-info">Призовой фонд 500 000 рублей</div>
        </div>
        <div class="synergy-text">
          <div>Энергетик будущего 2050</div>
          <div>СИНЕРГИЯ</div>
        </div>
      </div>

      <div class="mobile-container">
          <h1 class="hero-title">Хакатон</h1>
          <h1 class="hero-title">Цифровые двойники в энергетике</h1>
        <p class="subtitle">Командные соревнования по решению производственной задачи</p>
          <div class="prize-info">Призовой фонд 500 000 рублей</div>
        <div class="synergy-text">
          <div>Энергетик будущего 2050</div>
          <div>СИНЕРГИЯ</div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="stageStore.isOnlineDefense && showOnlineDefenseMaterials">
      <div v-if="canViewProtectedLinks" class="consultation-section">
        <div class="consultation-container">
          <div class="consultation-content">
            <h2>Торжественное закрытие Хакатона</h2>
            <div class="consultation-info">
              <div class="consultation-date">14:00 (МСК)</div>
              <div class="consultation-details">
                <p>Просим всех присоединиться для участия в торжественном закрытии Хакатона</p>
                <a href="https://bigbb2.tyuiu.ru/b/zah-tka-oxi-n4i"
                   target="_blank"
                   class="consultation-link">
                  <el-button type="primary" class="join-button">
                    Присоединиться к закрытию
                  </el-button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>


      <DefenseScheduleTable/>
    </div>

    <!-- Убрал временный блок с информацией -->
    <div v-if="false" class="consultation-section">
      <div class="consultation-container">
        <div class="consultation-content">
          <div class="consultation-badge">Важно!</div>
          <h2>Онлайн консультация для участников</h2>
          <div class="consultation-info">
            <div class="consultation-date">3 апреля в 9:30 (МСК)</div>
            <div class="consultation-details">
              <p>На консультации мы разберем основные моменты задания, ответим на ваши вопросы и обсудим технические
                детали решения</p>
              <a href="https://bigbb2.tyuiu.ru/b/zah-tka-oxi-n4i"
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
    <div class="info-section" ref="infoCardsRef">
      <div class="info-cards-container">
      <div class="info-cards">
          <div class="info-card animate-on-scroll">
          <el-icon>
            <User/>
          </el-icon>
            <h3 class="counter" data-target="100">0</h3>
          <p>участников</p>
        </div>
          <div class="info-card animate-on-scroll">
          <el-icon>
            <UserFilled/>
          </el-icon>
            <h3 v-if="stageStore.isRegistration" class="counter" :data-dynamic="true" ref="dynamicCounter">
              {{ activeTeamsCount }}/20
            </h3>
            <h3 v-else class="counter" data-target="20">20</h3>
          <p>команд</p>
        </div>
          <div class="info-card animate-on-scroll">
          <el-icon>
            <Monitor/>
          </el-icon>
          <h3>Онлайн</h3>
          <p>формат участия</p>
          </div>
        </div>
      </div>
    </div>

    <WinnersSection/>

    <!-- Модальное окно с информацией о команде из прошлых результатов -->
    <el-dialog
      v-model="teamDetailsVisible"
      :title="selectedTeam?.team_name || selectedTeam?.team || 'Информация о команде'"
      :width="isMobile ? '95%' : '600px'"
      :close-on-click-modal="true"
      class="team-details-dialog"
      :fullscreen="isMobile"
    >
      <div v-if="selectedTeam" class="team-details">
        <div class="team-details-header">
          <el-avatar
            :size="80"
            :src="getTeamLogoUrl(selectedTeam.team_id)"
            :alt="selectedTeam.team_name || selectedTeam.team"
          />
          <div class="team-details-title">
            <h3>{{ selectedTeam.team_name || selectedTeam.team }}</h3>
            <p v-if="selectedTeam.team_motto || selectedTeam.theme" class="team-motto-detail">
              {{ selectedTeam.team_motto || selectedTeam.theme }}
            </p>
          </div>
        </div>

        <div class="team-details-content">
          <div v-if="selectedTeam.members && selectedTeam.members.length > 0" class="members-section">
            <h4>Участники команды:</h4>
            <div class="members-list">
              <div
                v-for="(member, index) in selectedTeam.members"
                :key="index"
                class="member-item"
              >
                <el-icon class="member-icon">
                  <User/>
                </el-icon>
                <div class="member-info">
                  <div class="member-name">{{ member.full_name }}</div>
                  <div class="member-role">
                    {{ getRoleDisplayName(member.role) }}
                  </div>
                  <div v-if="member.vuz" class="member-vuz">{{ member.vuz }}</div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="selectedTeam.total_score !== undefined" class="score-section">
            <h4>Итоговый балл:</h4>
            <div class="score-value">{{ Math.round(selectedTeam.total_score) }}</div>
          </div>
        </div>
      </div>
    </el-dialog>

    <div class="task-section" ref="taskSectionRef">
      <h2>О соревнованиях</h2>
      <p>Командам необходимо создать цифровую модель энергообеспечения строительства скважин на месторождении.</p>
      <p>Формат участия - онлайн</p>
      <p>Участниками могут стать студенты вузов, колледжей и техникумов экосистемы ПАО «Газпром нефть» направления тепло- и электроэнергетики и других. Подробнее смотрите в <a
            href="/files/Положение о хакатоне Цифровые двойники в энергетике.pdf"
            target="_blank" class="terms-link">Положении</a>.</p>
    </div>

    <div class="timeline-section" ref="timelineRef">
      <div class="timeline-card">
      <h2>Таймлайн</h2>
      <div class="timeline-container">
        <div class="timeline-item animate-on-scroll">
          <div class="date">С 02.03.2026 в 00:00 (МСК)</div>
          <div class="event">Доступ к тексту задания в личном кабинете команды</div>
        </div>
        <div class="timeline-item animate-on-scroll">
          <div class="date">27.03.2026 в 13:00 (МСК)</div>
          <div class="event">Установочная встреча с участниками Хакатона</div>
          <div class="note">
            <a v-if="canViewProtectedLinks" href="https://bigbb2.tyuiu.ru/b/zah-tka-oxi-n4i" target="_blank" class="timeline-link">
              Подключиться к встрече
            </a>
          </div>
        </div>
        <div class="timeline-item animate-on-scroll">
          <div class="date">До 27.03.2026 до 23:59 (МСК)</div>
          <div class="event">Регистрация на сайте</div>
          <div class="note">(регистрация может закончиться раньше)</div>
        </div>
        <div class="timeline-item animate-on-scroll">
          <div class="date">01.04.2026 в 09:00 (МСК)</div>
          <div class="event">Онлайн открытие Хакатона</div>
          <div class="note">
            <a v-if="canViewProtectedLinks" href="https://bigbb2.tyuiu.ru/b/zah-tka-oxi-n4i" target="_blank" class="timeline-link">
              Подключиться к открытию
            </a>
          </div>
        </div>
        <div class="timeline-item animate-on-scroll">
          <div class="date">С 01.04.2026 в 09:30 (МСК)</div>
          <div class="event">Доступ к тестовым данным для решения задачи в личном кабинете команды</div>
        </div>
        <div class="timeline-item animate-on-scroll">
          <div class="date">Через 24 часа, но не позднее 02.04.2026 в 09:30 (МСК)</div>
          <div class="event">Загрузка готовых решений в личном кабинете команды</div>
        </div>
        <div class="timeline-item animate-on-scroll">
          <div class="date">02.04.2026 в 12:00 (МСК)</div>
          <div class="event">Защита проектов</div>
          <div class="note">
            <a v-if="canViewProtectedLinks" href="https://bigbb2.tyuiu.ru/b/zah-tka-oxi-n4i" target="_blank" class="timeline-link">
              Подключиться к защите
            </a>
          </div>
        </div>
        </div>
      </div>
    </div>

    <div class="stages-section" ref="stagesRef">
      <div class="stages-card">
      <h2>Этапы</h2>
        <div v-if="loadingStages" class="stages-loading">
          <el-skeleton :rows="5" animated />
        </div>
        <div v-else class="stages-container">
        <div
            v-for="(groupStages, groupName) in orderedGroupedStages"
            :key="groupName"
            class="stage-group animate-on-scroll"
        >
          <div class="stage-group-header">
            <div class="group-header-content">
              <el-icon class="group-icon">
                <component :is="getGroupIcon(groupName)"/>
              </el-icon>
              <h3>{{ groupNames[groupName] || groupName }}</h3>
            </div>
            <div class="group-stages-count hidden md:inline-flex">{{ groupStages.length }} {{ getStageWord(groupStages.length) }}</div>
          </div>
          <div class="group-stages-list">
            <div
                v-for="(stage, index) in groupStages"
                :key="stage.id"
                class="stage-item animate-on-scroll"
            :class="{
          'stage-completed': isStageCompleted(stage.order),
          'stage-current': isCurrentStage(stage.order),
          'stage-upcoming': isStageUpcoming(stage.order)
        }"
                :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="stage-number">{{ stage.order }}</div>
          <el-icon>
                <component :is="getStageIcon(stage.type)"/>
          </el-icon>
              <span>{{ stage.name }}</span>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>

    <!-- Блок результатов прошлых лет -->
    <div class="past-results-section" ref="pastResultsRef" v-if="pastResults.length > 0">
      <div class="past-results-card">
        <h2 class="section-title">Результаты прошлых лет</h2>
        <div v-if="loadingPastResults" class="loading-past-results">
          <el-skeleton :rows="3" animated />
        </div>
        <div v-else class="past-results-container">
          <div 
            v-for="(year, index) in pastResults" 
            :key="year.event_id || index"
            class="past-year-card animate-on-scroll"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div class="year-badge">{{ year.year }}</div>
            <div class="event-name" v-if="year.event_name">{{ year.event_name }}</div>
            <!-- Победители -->
            <div class="year-winners" v-if="year.winners && year.winners.length > 0">
              <h3 class="winners-title">Победители</h3>
              <div class="winner-item" v-for="(winner, wIndex) in year.winners" :key="wIndex" @click="openTeamDetails(winner, year.event_id)">
              <div class="winner-logo-container">
                <el-avatar
                  :size="60"
                  :src="getTeamLogoUrl(winner.team_id)"
                  class="winner-logo"
                >
                  <el-icon><UserFilled /></el-icon>
                </el-avatar>
                <div class="winner-medal" :class="winner.place">
                  <el-icon>
                    <Trophy v-if="winner.place === 'gold'"/>
                    <Medal v-else/>
                  </el-icon>
                </div>
              </div>
              <div class="winner-info">
                <h4>{{ winner.team }}</h4>
                <p class="winner-theme">{{ winner.theme }}</p>
                <p class="winner-score" v-if="winner.score">Балл: {{ Math.round(winner.score) }}</p>
              </div>
            </div>
            </div>
          
            <!-- Финалисты -->
            <div class="year-finalists" v-if="year.finalists && year.finalists.length > 0">
              <h3 class="finalists-title">Финалисты</h3>
              <div class="finalist-item" v-for="(finalist, fIndex) in year.finalists" :key="fIndex" @click="openTeamDetails(finalist, year.event_id)">
                <div class="finalist-logo-container">
                <el-avatar
                  :size="50"
                  :src="getTeamLogoUrl(finalist.team_id)"
                  class="finalist-logo"
                >
                  <el-icon><UserFilled /></el-icon>
                </el-avatar>
                </div>
                <div class="finalist-info">
                  <h4>{{ finalist.team }}</h4>
                  <p class="finalist-theme" v-if="finalist.theme">{{ finalist.theme }}</p>
                  <p class="finalist-score" v-if="finalist.score">Балл: {{ Math.round(finalist.score) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <TheFooter></TheFooter>
</template>

<script setup>
import {ref, onMounted, onUnmounted, computed, watch, nextTick} from 'vue';
import {useRouter} from 'vue-router';
import {UserFilled, Document, Monitor, Check, Trophy, Star, Medal, User, Finished} from '@element-plus/icons-vue'
import TheHeader from "@/components/TheHeader.vue";
import TheFooter from "@/components/TheFooter.vue";
import AuthRequiredModal from "@/components/auth/AuthRequiredModal.vue";
import WinnersSection from "@/components/WinnersSection.vue"
import {useStageStore} from "@/stores/stage.js";
import {useAuthStore} from "@/stores/auth.js";
import DefenseScheduleTable from "@/components/DefenseScheduleTable.vue";
import { eventsApi } from '@/api/events';
import { stagesApi } from '@/api/stages';
import { teamsApi } from '@/api/teams';

const router = useRouter();
const showAuthModal = ref(false);
const isHeaderHidden = ref(false);
const lastScrollPosition = ref(0);
const scrollThreshold = 100;

// Refs для анимаций
const pastResultsRef = ref(null);
const taskSectionRef = ref(null);
const infoCardsRef = ref(null);
const timelineRef = ref(null);
const stagesRef = ref(null);

// Данные результатов прошлых лет
const pastResults = ref([]);
const loadingPastResults = ref(false);

// Счетчик активных команд
const activeTeamsCount = ref(0);
const dynamicCounter = ref(null);
const isCounterAnimated = ref(false);

// Модальное окно с информацией о команде
const teamDetailsVisible = ref(false);
const selectedTeam = ref(null);

// Проверка мобильного устройства
const isMobile = computed(() => window.innerWidth <= 768);

// Проверка валидности счетчика активных команд
const isValidActiveTeamsCount = computed(() => {
  return stageStore.isRegistration && typeof activeTeamsCount.value === 'number' && !isNaN(activeTeamsCount.value);
});

// Данные этапов
const stages = ref([]);
const loadingStages = ref(false);
const groupedStages = computed(() => {
  const groups = {};
  stages.value.forEach(stage => {
    const group = stage.group || 'other';
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(stage);
  });
  // Сортируем этапы внутри каждой группы по order
  Object.keys(groups).forEach(group => {
    groups[group].sort((a, b) => a.order - b.order);
  });
  return groups;
});

// Маппинг типов этапов на иконки
const getStageIcon = (stageType) => {
  const iconMap = {
    'registration': UserFilled,
    'registration_closed': Finished,
    'task_distribution': Document,
    'remote_task_distribution': Document,
    'on_site_task_distribution': Document,
    'solution_submission': Monitor,
    'remote_solution_submission': Monitor,
    'on_site_solution_submission': Monitor,
    'solution_review': Check,
    'remote_solution_review': Check,
    'online_defense': Trophy,
    'on_site_defense': Trophy,
    'results_publication': Star,
    'award_ceremony': Medal,
    'finalists_selection': Star
  };
  return iconMap[stageType] || Document;
};

// Иконки для групп
const getGroupIcon = (groupName) => {
  const iconMap = {
    'registration': UserFilled,
    'remote': Monitor,
    'on_site': Trophy,
    'final': Star,
    'other': Document
  };
  return iconMap[groupName] || Document;
};

// Склонение слова "этап"
const getStageWord = (count) => {
  if (count % 10 === 1 && count % 100 !== 11) return 'этап';
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'этапа';
  return 'этапов';
};

// Названия групп
const groupNames = {
  'registration': 'РЕГИСТРАЦИЯ',
  'remote': 'ЗАОЧНЫЙ ЭТАП',
  'on_site': 'ОЧНЫЙ ЭТАП',
  'final': 'ФИНАЛИСТЫ',
  'other': 'ЗАВЕРШЕНИЕ'
};

// Порядок отображения групп
const groupOrder = ['registration', 'remote', 'final', 'on_site', 'other'];

// Упорядоченные группы для отображения
const orderedGroupedStages = computed(() => {
  const groups = groupedStages.value;
  const ordered = {};
  
  // Сначала добавляем группы в нужном порядке
  groupOrder.forEach(groupName => {
    if (groups[groupName] && groups[groupName].length > 0) {
      ordered[groupName] = groups[groupName];
    }
  });
  
  // Затем добавляем остальные группы
  Object.keys(groups).forEach(groupName => {
    if (!ordered[groupName] && groups[groupName].length > 0) {
      ordered[groupName] = groups[groupName];
    }
  });
  
  return ordered;
});

// Intersection Observer для анимаций
let observer = null;

const setupAnimations = () => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        
        // Анимация счетчиков (только для статических, не для динамических)
        const counter = entry.target.querySelector('.counter');
        if (counter && !counter.classList.contains('animated') && counter.hasAttribute('data-target')) {
          counter.classList.add('animated');
          const target = parseInt(counter.getAttribute('data-target'));
          if (!isNaN(target)) {
            animateCounter(counter, target);
          }
        }
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  // Наблюдаем за элементами
  const elementsToAnimate = document.querySelectorAll('.animate-on-scroll, .task-section, .past-results-section');
  elementsToAnimate.forEach(el => observer.observe(el));
};

// Функция анимации счетчика
const animateCounter = (element, target, isDynamic = false) => {
  let current = 0;
  const increment = target / 50;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      if (isDynamic) {
        activeTeamsCount.value = target;
      } else {
        element.textContent = target;
      }
      clearInterval(timer);
    } else {
      if (isDynamic) {
        activeTeamsCount.value = Math.floor(current);
      } else {
        element.textContent = Math.floor(current);
      }
    }
  }, 30);
};

const stageStore = useStageStore();
const authStore = useAuthStore();
const showOnlineDefenseMaterials = false;

const canViewProtectedLinks = computed(() => {
  if (!authStore.isAuthenticated || !authStore.user) {
    return false;
  }

  const roleNames = (authStore.user.roles || []).map((role) => role.name?.toLowerCase());
  const hasPrivilegedRole = roleNames.some((role) =>
    ['mentor', 'judge', 'admin', 'organizer'].includes(role)
  );

  if (hasPrivilegedRole) {
    return true;
  }

  const isParticipant = roleNames.includes('participant');
  const isApprovedParticipant = authStore.user.current_status?.name === 'approved';

  return isParticipant && isApprovedParticipant;
});

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

const currentOrder = computed(() => {
  // Если текущий этап не загружен, возвращаем 0, чтобы все этапы отображались как upcoming
  return stageStore.currentStage?.order || 0;
});

const isStageCompleted = (stageOrder) => {
  // Если текущий этап не загружен, не помечаем ничего как завершенное
  if (!stageStore.currentStage) return false;
  return stageOrder < currentOrder.value;
};

const isCurrentStage = (stageOrder) => {
  // Если текущий этап не загружен, не помечаем ничего как текущее
  if (!stageStore.currentStage) return false;
  return stageOrder === currentOrder.value;
};

const isStageUpcoming = (stageOrder) => {
  // Если текущий этап не загружен, все этапы считаются upcoming
  if (!stageStore.currentStage) return true;
  return stageOrder > currentOrder.value;
};

const loadStages = async () => {
  try {
    loadingStages.value = true;
    const stagesData = await stagesApi.getPublicStages();
    stages.value = stagesData;
  } catch (error) {
    console.error('Ошибка при загрузке этапов:', error);
    stages.value = [];
  } finally {
    loadingStages.value = false;
  }
};


const handleApplicationClick = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    showAuthModal.value = true;
  } else {
    router.push('/team/apply');
  }
};

const getTeamLogoUrl = (teamId) => {
  if (!teamId) return null;
  return `${import.meta.env.VITE_API_URL}/teams/${teamId}/logo`;
};

// Вспомогательная функция для отображения ролей
const getRoleDisplayName = (role) => {
  if (!role) return 'Участник'
  const roleLower = role.toLowerCase()
  switch (roleLower) {
    case 'teamlead': return 'Капитан'
    case 'mentor': return 'Наставник'
    case 'member': return 'Участник'
    default: return role
  }
};

const loadPastResults = async () => {
  try {
    loadingPastResults.value = true;
    const results = await eventsApi.getPastEventsResults();
    pastResults.value = results;
  } catch (error) {
    console.error('Ошибка при загрузке результатов прошлых лет:', error);
    // В случае ошибки оставляем пустой массив
    pastResults.value = [];
  } finally {
    loadingPastResults.value = false;
  }
};

// Открытие модального окна с информацией о команде из прошлых результатов
const openTeamDetails = async (team, eventId) => {
  if (!team || !team.team_id) {
    console.warn('openTeamDetails: нет team или team_id', { team, eventId });
    return;
  }
  
  console.log('openTeamDetails вызвана:', { team_id: team.team_id, event_id: eventId });
  
  try {
    // Загружаем информацию о команде через публичный endpoint
    // Передаем event_id для прошлых результатов
    const teamInfo = await teamsApi.getPublicTeamInfo(team.team_id, eventId);
    console.log('Информация о команде загружена:', teamInfo);
    
    // Объединяем данные команды с загруженной информацией
    selectedTeam.value = {
      team_id: team.team_id,
      team_name: teamInfo.team_name || team.team,
      team_motto: teamInfo.team_motto || team.theme,
      members: teamInfo.members || [],
      vuz_list: teamInfo.vuz_list || [],
      total_score: teamInfo.total_score || team.score
    };
    
    console.log('selectedTeam установлен:', selectedTeam.value);
    teamDetailsVisible.value = true;
    console.log('teamDetailsVisible установлен в true');
  } catch (error) {
    console.error('Ошибка при загрузке информации о команде:', error);
    // В случае ошибки показываем хотя бы базовую информацию
    selectedTeam.value = {
      team_id: team.team_id,
      team_name: team.team,
      team_motto: team.theme,
      total_score: team.score,
      members: [],
      vuz_list: []
    };
    teamDetailsVisible.value = true;
    console.log('Модальное окно открыто с базовой информацией');
  }
};

// Загрузка количества активных команд
const loadActiveTeamsCount = async () => {
  if (!stageStore.isRegistration) {
    activeTeamsCount.value = 0;
    isCounterAnimated.value = false;
    return;
  }
  
  try {
    const response = await teamsApi.getActiveTeamsCount();
    const rawCount = response?.active_teams_count;
    let count = 0;
    
    if (rawCount !== undefined && rawCount !== null) {
      if (typeof rawCount === 'number') {
        count = rawCount;
      } else {
        count = Number(rawCount);
      }
    }
    
    // Гарантируем, что это валидное число
    if (isNaN(count) || !isFinite(count)) {
      count = 0;
    }
    
    const finalCount = Math.max(0, Math.floor(count));
    
    // Если счетчик еще не анимирован, запускаем анимацию
    if (!isCounterAnimated.value && finalCount > 0) {
      activeTeamsCount.value = 0;
      // Ждем следующего тика для применения изменений и рендеринга элемента
      await nextTick();
      // Пробуем найти элемент через DOM, если ref еще не готов
      const counterElement = dynamicCounter.value || document.querySelector('.counter[data-dynamic="true"]');
      if (counterElement) {
        animateCounter(counterElement, finalCount, true);
        isCounterAnimated.value = true;
      } else {
        // Если элемент не найден, просто устанавливаем значение
        activeTeamsCount.value = finalCount;
        isCounterAnimated.value = true;
      }
    } else {
      activeTeamsCount.value = finalCount;
    }
  } catch (error) {
    activeTeamsCount.value = 0;
    isCounterAnimated.value = false;
  }
};

// Отслеживаем изменение этапа и загружаем счетчик
watch(() => stageStore.isRegistration, async (isRegistration) => {
  if (isRegistration) {
    // Сбрасываем флаг анимации при смене этапа
    isCounterAnimated.value = false;
    // Загружаем сразу с анимацией
    await loadActiveTeamsCount();
  } else {
    activeTeamsCount.value = 0;
    isCounterAnimated.value = false;
  }
}, { immediate: true });


onMounted(async () => {
  // Загружаем текущий этап, но не блокируем отображение страницы при ошибке
  try {
  await stageStore.fetchCurrentStage();
  } catch (error) {
    // Если нет активного этапа или другая ошибка - это нормально,
    // этапы все равно должны отображаться
    console.log('Текущий этап не найден или ошибка загрузки:', error);
  }
  await loadStages();
  await loadPastResults();
  
  // Загружаем счетчик после загрузки этапа (watch уже должен был вызвать, но на всякий случай)
  if (stageStore.isRegistration) {
    await loadActiveTeamsCount();
  }
  
  // Настраиваем анимации после монтирования
  setTimeout(() => {
    setupAnimations();
  }, 100);
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
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
  margin-top: 64px; /* Высота нового хедера */
  background-color: #f8fafc; /* bg-slate-50 - единый фон для всех секций */
  overflow-x: hidden;
  width: 100%;
  max-width: 100%;
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
  width: 100%;
  min-height: 85vh; /* min-h-[85vh] */
  min-height: 800px; /* min-h-[800px] */
  background-image: url('../assets/img/img.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
  margin: 0;
  margin-bottom: 0;
}

.hero-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 60px;
  height: 100%;
  position: relative;
  z-index: 2;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5); /* Увеличено затемнение для лучшей читаемости белого текста */
}

.desktop-container {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0;
  height: 100%;
  position: relative;
  z-index: 2;
}

.desktop-container .hero-content {
  color: white;
  max-width: 600px;
  text-align: left;
}

.desktop-container .synergy-text {
  color: white;
  font-weight: bold;
  font-size: 18px;
  text-align: right;
  position: absolute;
  right: 0;
  bottom: 0;
  white-space: nowrap;
  animation: fadeInUp 0.8s ease-out 0.5s both;
}

.mobile-container {
  display: none;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px 20px;
  height: 100%;
  position: relative;
  z-index: 2;
  color: white;
  justify-content: space-between;
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

.hero-title {
  font-size: 48px; /* text-4xl на мобильных */
  line-height: 1.1;
  margin-bottom: 20px;
  font-weight: bold;
  color: white;
  animation: fadeInUp 0.8s ease-out;
  text-align: left;
}

.hero-content h1 {
  font-size: 48px; /* text-4xl на мобильных */
  line-height: 1.1;
  margin-bottom: 20px;
  font-weight: bold;
  color: white;
  animation: fadeInUp 0.8s ease-out;
  text-align: left;
}

@media (min-width: 768px) {
  .hero-content h1,
  .hero-title {
    font-size: 64px; /* md:text-6xl на десктопе */
  }

  .stages-card h2,
  .timeline-card h2,
  .section-title {
    font-size: 32px; /* md:text-4xl на десктопе */
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Анимации при скролле */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-on-scroll.animate-in {
  opacity: 1;
  transform: translateY(0);
}

/* Анимация для hero секции */
.hero-content p {
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.prize-info {
  animation: fadeInUp 0.8s ease-out 0.4s both;
  color: #fbbf24;
  font-weight: bold;
  font-size: 28px;
  margin-top: 20px;
}

.custom-button {
  animation: fadeInUp 0.8s ease-out 0.6s both;
}

.hero-content p {
  font-size: 24px;
  margin-bottom: 30px;
  text-align: left;
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
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (max-width: 767px) {
  .task-section {
    padding: 30px 20px; /* px-5 на мобильных */
    text-align: center; /* text-center на мобильных */
  }
  
  .task-section h2,
  .task-section p {
    text-align: center; /* text-center на мобильных */
  }
}

@media (min-width: 768px) {
  .task-section {
    text-align: left; /* md:text-left на десктопе */
  }
}

.task-section.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.task-section h2 {
  font-size: 32px;
  margin-bottom: 20px;
  color: #333;
  font-weight: bold;
}

@media (max-width: 767px) {
  .task-section h2 {
    text-align: center; /* text-center на мобильных */
  }
}

@media (min-width: 768px) {
  .task-section h2 {
    text-align: left; /* md:text-left на десктопе */
  }
}

.task-section p {
  font-size: 16px;
  line-height: 1.6;
  color: #666;
  margin-bottom: 15px;
}

.stages-section {
  background: #f8fafc; /* bg-slate-50 */
  padding: 40px 20px;
  color: #111827; /* text-gray-900 */
  border-radius: 0;
  margin: 0;
  width: 100%;
}

.stages-container {
  max-width: 900px;
  margin: 0 auto;
}

.stage-group {
  margin-bottom: 40px;
  background: white;
  border-radius: 12px;
  padding: 25px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

@media (max-width: 767px) {
  .stage-group {
    background: transparent; /* bg-transparent на мобильных */
    border-radius: 0; /* rounded-none */
    padding: 0; /* Убираем padding */
    border: 0; /* border-0 */
    box-shadow: none; /* shadow-none */
    margin-bottom: 32px; /* Уменьшаем отступ между группами */
  }
  
  .stage-group:hover {
    box-shadow: none;
    transform: none;
  }
}

.stage-group:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.stage-group-header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@media (max-width: 767px) {
  .stage-group-header {
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #e5e7eb; /* Оставляем разделитель */
  }
}

.group-header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.group-icon {
  font-size: 28px;
  color: #2563eb; /* text-blue-600 - насыщенный синий */
}

.stage-group-header h3 {
  color: #111827; /* text-gray-900 */
  font-size: 22px;
  font-weight: 600;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.group-stages-count {
  color: #6b7280; /* text-gray-500 */
  font-size: 14px;
  font-weight: 500;
  background: #f3f4f6; /* bg-gray-100 */
  padding: 6px 12px;
  border-radius: 20px;
  display: none; /* Скрываем на мобильных по умолчанию */
  align-items: center;
}

@media (min-width: 768px) {
  .group-stages-count {
    display: inline-flex; /* Показываем на десктопе */
  }
}

.group-stages-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@media (max-width: 767px) {
  .group-stages-list {
    gap: 0; /* Убираем gap, используем divide-y */
    /* Убрали border-top - не нужна линия над первым этапом */
  }
  
  .group-stages-list > .stage-item {
    border-bottom: 1px solid #e2e8f0; /* divide-slate-200 - разделители между этапами */
  }
  
  .group-stages-list > .stage-item:last-child {
    border-bottom: none; /* Убираем border у последнего элемента */
  }
}

.stages-loading {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.stage-item {
  background: white; /* bg-white */
  padding: 18px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 15px;
  position: relative;
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
  margin-bottom: 0;
  color: #111827; /* text-gray-900 */
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
}

@media (max-width: 767px) {
  .stage-item {
    background: transparent; /* Убираем фон */
    border: 0; /* Убираем border */
    box-shadow: none; /* Убираем тень */
    border-radius: 0; /* Убираем скругления */
    padding: 16px 0; /* Упрощаем padding, только вертикальный */
    margin-bottom: 0;
    width: 100%; /* w-full */
    display: flex; /* Горизонтальное выравнивание */
    align-items: center; /* Выравнивание по центру */
    gap: 12px; /* Отступ между элементами */
  }
  
  /* Упрощаем бейдж номера этапа на мобильном */
  .stage-item .stage-number {
    width: 24px; /* Уменьшаем размер */
    height: 24px;
    font-size: 12px; /* Уменьшаем шрифт */
    background: transparent; /* Прозрачный фон */
    border: 1px solid #cbd5e1; /* Тонкая граница */
    color: #64748b; /* Серый цвет */
    flex-shrink: 0; /* Не сжимается */
  }
  
  /* Стили для разных состояний этапов на мобильном */
  .stage-completed .stage-number {
    background: transparent;
    border-color: #e2e8f0;
    color: #94a3b8;
  }
  
  .stage-current .stage-number {
    background: #bfdbfe; /* bg-blue-200 */
    border-color: #2563eb; /* border-blue-600 */
    color: #1e40af; /* text-blue-800 */
  }
  
  /* Активный этап на мобильном: светлый фон и левая акцентная граница */
  .stage-item.stage-current {
    background: #eff6ff !important; /* bg-blue-50 - светлый фон на всю ширину */
    border: 0 !important; /* Убираем полную рамку (переопределяем border: 2px solid) */
    border-left: 4px solid #2563eb !important; /* border-l-4 border-blue-600 - левая акцентная граница */
    border-radius: 0 !important; /* Убираем скругления */
    padding-left: 12px; /* Добавляем отступ слева для акцентной границы */
    margin-left: 0; /* Убираем отступ слева */
    margin-right: 0; /* Убираем отступ справа */
    box-shadow: none !important; /* Убираем тени */
  }
  
  /* Убираем псевдоэлемент ::before на мобильном */
  .stage-item.stage-current::before {
    display: none !important;
  }
  
  .stage-item.stage-current span {
    color: #1e40af; /* text-blue-800 */
    font-weight: 600;
  }
  
  .stage-item.stage-current .el-icon {
    color: #1e40af; /* text-blue-800 */
  }
  
  /* Иконка и текст в одну линию */
  .stage-item .el-icon {
    flex-shrink: 0; /* Иконка не сжимается */
    font-size: 20px; /* Немного уменьшаем иконку */
  }
  
  .stage-item span {
    flex: 1; /* Текст занимает оставшееся место */
    font-size: 14px; /* Уменьшаем размер текста */
    line-height: 1.4;
  }
}

.stage-item span {
  color: #111827; /* text-gray-900 */
  font-weight: 500;
}

.stage-number {
  background: #e5e7eb; /* bg-gray-200 */
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #374151; /* text-gray-700 */
  font-size: 14px;
}

.stage-item .el-icon {
  font-size: 24px;
  color: #2563eb; /* text-blue-600 - насыщенный синий */
}

.stages-card {
  background: white;
  border-radius: 16px; /* rounded-2xl */
  padding: 32px; /* p-8 */
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1); /* shadow-sm */
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 767px) {
  .stages-card {
    background: transparent; /* bg-transparent на мобильных */
    box-shadow: none; /* shadow-none */
    border: 0; /* border-0 */
    border-radius: 0; /* rounded-none */
    padding: 0; /* p-0 */
    width: 100%; /* w-full */
    max-width: 100%; /* Убираем ограничение ширины */
  }
}

.stages-card h2 {
  text-align: center; /* Центрируем на мобильных */
  margin-bottom: 30px;
  font-size: 32px; /* md:text-4xl */
  font-weight: 600;
  color: #111827; /* text-gray-900 */
}

@media (min-width: 768px) {
  .stages-card {
    background: white; /* md:bg-white */
    border-radius: 16px; /* md:rounded-2xl */
    padding: 32px; /* md:p-8 */
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1); /* md:shadow-sm */
  }
  
  .stages-card h2 {
    text-align: left; /* md:text-left на десктопе */
  }
  
  .stage-group {
    background: white; /* md:bg-white */
    border-radius: 12px; /* md:rounded-xl */
    padding: 25px; /* md:p-6 */
    border: 1px solid #e5e7eb; /* md:border */
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1); /* md:shadow-sm */
  }
  
  .stage-item {
    background: white; /* md:bg-white */
    border: 1px solid #e5e7eb; /* md:border */
    border-radius: 8px; /* md:rounded-lg */
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1); /* md:shadow-sm */
    padding: 18px 20px; /* md:p-5 */
  }
  
  .group-stages-list {
    gap: 12px; /* md:gap-3 */
  }
  
  /* Убрали border-bottom: none для активного этапа на десктопе */
}

.subtitle {
  font-size: 20px;
  margin-bottom: 15px;
  text-align: left;
}

.prize-info {
  font-size: 28px;
  color: #fbbf24;
  margin-bottom: 30px;
  font-weight: bold;
  text-align: left;
}

.info-section {
  padding: 0 20px 40px;
  margin-top: -80px; /* Overlap только на десктопе */
  position: relative;
  z-index: 10;
}

@media (min-width: 769px) {
  .info-section {
    margin-top: -80px; /* Overlap эффект только на десктопе */
  }
}

.info-cards-container {
  max-width: 1200px;
  margin: 0 auto;
}

.info-cards {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.info-card {
  background: white;
  padding: 40px 30px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  flex: 1;
  min-width: 200px;
  max-width: 300px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.info-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 24px rgba(0, 163, 255, 0.2);
}

.info-card .el-icon {
  transition: all 0.3s ease;
  color: #2563eb; /* text-blue-600 - насыщенный синий */
  font-size: 40px;
}

.info-card:hover .el-icon {
  transform: scale(1.2) rotate(5deg);
  color: #1d4ed8; /* text-blue-700 - темнее при hover */
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
  padding: 48px 20px; /* py-12 */
  background: transparent; /* Прозрачный фон */
  border-radius: 0;
  margin: 0;
  width: 100%;
}

@media (max-width: 768px) {
  .timeline-section {
    padding: 30px 24px; /* px-6 на мобильных */
  }
}

.timeline-card {
  background: white;
  border-radius: 16px; /* rounded-2xl */
  padding: 32px; /* p-8 */
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1); /* shadow-sm */
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 767px) {
  .timeline-card {
    background: transparent; /* bg-transparent на мобильных */
    box-shadow: none; /* shadow-none */
    border-radius: 0; /* rounded-none */
    padding: 0; /* p-0 */
    width: 100%; /* w-full */
    max-width: 100%; /* Убираем ограничение ширины */
  }
}

.timeline-card h2 {
  text-align: center; /* Центрируем на мобильных */
  margin-bottom: 40px;
  font-size: 32px; /* md:text-4xl */
  font-weight: 600;
  color: #111827; /* text-gray-900 */
}

@media (min-width: 768px) {
  .timeline-card {
    background: white; /* md:bg-white */
    border-radius: 16px; /* md:rounded-2xl */
    padding: 32px; /* md:p-8 */
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1); /* md:shadow-sm */
  }
  
  .timeline-card h2 {
    text-align: left; /* md:text-left на десктопе */
  }
  
  .timeline-item {
    background: white; /* md:bg-white */
    border-radius: 12px; /* md:rounded-xl */
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1); /* md:shadow-sm */
    padding: 24px; /* md:p-6 */
    margin-bottom: 20px; /* md:mb-5 */
  }
  
  .timeline-container {
    border-top: none; /* Убираем divide-y на десктопе */
  }
  
  .timeline-item {
    border-bottom: none; /* Убираем divide-y на десктопе */
  }
}

.timeline-container {
  max-width: 800px;
  margin: 0 auto;
}

@media (max-width: 767px) {
  .timeline-container {
    width: 100%; /* w-full на мобильных */
    max-width: 100%;
  }
}

.timeline-item {
  background: white;
  padding: 24px;
  border-radius: 12px; /* rounded-xl */
  margin-bottom: 20px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

@media (max-width: 767px) {
  .timeline-item {
    background: transparent; /* Убираем белый фон */
    border: 0; /* Убираем границы */
    border-radius: 0; /* Убираем скругления */
    box-shadow: none; /* Убираем тени */
    padding: 16px 0; /* Упрощаем padding, только вертикальный */
    margin-bottom: 0; /* Убираем margin */
    width: 100%; /* w-full */
  }
  
  /* Добавляем divide-y эффект для разделения элементов */
  .timeline-container {
    border-top: 1px solid #e2e8f0; /* divide-slate-200 - верхняя граница */
  }
  
  .timeline-item {
    border-bottom: 1px solid #e2e8f0; /* divide-slate-200 - разделители между элементами */
  }
  
  .timeline-item:last-child {
    border-bottom: none; /* Убираем border у последнего элемента */
  }
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, #00A3FF 0%, #5B51D8 100%);
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.timeline-item:hover {
  transform: translateX(10px);
  box-shadow: 0 4px 16px rgba(0, 163, 255, 0.2);
}

.timeline-item:hover::before {
  transform: scaleY(1);
}

.timeline-item .date {
  font-weight: 700; /* font-bold */
  color: #1d4ed8; /* text-blue-700 */
  margin-bottom: 8px;
  font-size: 16px;
}

.timeline-item .event {
  font-size: 18px;
  margin-bottom: 8px;
  color: #111827; /* text-gray-900 - темный */
  font-weight: 500;
}

.timeline-item .note {
  font-size: 14px;
  color: #4b5563; /* text-gray-600 - серый */
  font-style: italic;
}

@media (max-width: 767px) {
  .timeline-item .date {
    font-weight: 700; /* font-bold - жирная дата */
    color: #1d4ed8; /* text-blue-700 */
    margin-bottom: 6px;
    font-size: 14px; /* text-sm */
    line-height: 1.4;
  }
  
  .timeline-item .event {
    font-size: 14px; /* text-sm */
    margin-bottom: 4px;
    color: #111827; /* text-gray-900 - читаемый темный цвет */
    font-weight: 500;
    line-height: 1.5;
  }
  
  .timeline-item .note {
    font-size: 12px; /* text-xs */
    color: #64748b; /* text-slate-500 */
    font-style: italic;
    line-height: 1.4;
    margin-top: 4px;
  }
}

.timeline-link {
  color: #00A3FF;
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.3s ease;
}

.timeline-link:hover {
  color: #5B51D8;
}

.partner-logo {
  position: absolute;
  right: 60px;
  top: 40px;
  text-align: right;
  color: white;
  z-index: 2;
}

.partner-label {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 5px;
}

.partner-name {
  font-size: 18px;
  font-weight: bold;
}

.partner-logo-mobile {
  text-align: center;
  color: white;
  margin-top: 20px;
  z-index: 2;
}

.partner-logo-mobile .partner-label {
  font-size: 12px;
  opacity: 0.9;
  margin-bottom: 5px;
}

.partner-logo-mobile .partner-name {
  font-size: 16px;
  font-weight: bold;
}


.stages-section {
  background: #f8fafc; /* bg-slate-50 */
  padding: 40px 20px;
  color: #111827; /* text-gray-900 */
  border-radius: 0;
  margin: 0;
  width: 100%;
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
  cursor: pointer;
}

.stage-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(10px);
}

.stage-item .el-icon {
  transition: all 0.3s ease;
  color: #2563eb; /* text-blue-600 - насыщенный синий */
  font-size: 24px;
}

.stage-item:hover .el-icon {
  transform: scale(1.2) rotate(5deg);
  color: #1d4ed8; /* text-blue-700 - темнее при hover */
}

.stage-completed {
  background: #f3f4f6; /* bg-gray-100 */
  color: #6b7280; /* text-gray-500 */
}

.stage-completed span {
  color: #6b7280; /* text-gray-500 */
}

.stage-current {
  background: #dbeafe; /* bg-blue-100 */
  border: 2px solid #2563eb; /* border-blue-600 */
  color: #1e40af; /* text-blue-800 */
}

.stage-current span {
  color: #1e40af; /* text-blue-800 */
  font-weight: 600;
}

.stage-upcoming {
  background: white;
  color: #111827; /* text-gray-900 */
}

.stage-upcoming span {
  color: #4b5563; /* text-gray-600 */
}

.stage-number {
  background: #dbeafe; /* bg-blue-100 - светло-синий фон */
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1e40af; /* text-blue-700 - темно-синий цвет текста */
  font-weight: bold;
}

.stage-completed .el-icon {
  color: #6b7280; /* text-gray-500 - серый для завершенных */
}

.stage-current .el-icon {
  color: #1e40af; /* text-blue-800 - темно-синий для текущего */
}

.stage-upcoming .el-icon {
  color: #2563eb; /* text-blue-600 - синий для предстоящих */
}

.stage-current::before {
  content: '•';
  position: absolute;
  left: -20px;
  color: #4CAF50;
  font-size: 24px;
}

.stage-completed .stage-number {
  background: #f3f4f6; /* bg-gray-100 - серый фон */
  color: #6b7280; /* text-gray-500 - серый цвет текста */
}

.stage-current .stage-number {
  background: #bfdbfe; /* bg-blue-200 - более яркий синий фон */
  color: #1e40af; /* text-blue-800 - темно-синий цвет текста */
  border: 1px solid #2563eb; /* border-blue-600 */
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
    width: 100%;
    min-height: auto; /* Убираем фиксированную высоту */
    margin: 0;
    margin-bottom: 0;
  }

  .hero-wrapper {
    padding: 80px 20px; /* py-20 */
  }

  .mobile-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    min-height: auto;
    padding: 80px 20px; /* py-20 */
  }

  .mobile-container .synergy-text {
    margin-top: auto;
    padding-top: 30px;
    width: 100%;
    animation: fadeInUp 0.8s ease-out 0.5s both;
  }

  .mobile-container h1,
  .mobile-container .hero-title {
    font-size: 30px; /* text-3xl */
    line-height: 1.2;
    margin-bottom: 16px;
    animation: fadeInUp 0.8s ease-out;
    color: white;
  }

  .mobile-container h1:nth-child(2) {
    animation: fadeInUp 0.8s ease-out 0.1s both;
  }

  .mobile-container p {
    font-size: 14px; /* text-sm */
    margin-bottom: 12px;
    animation: fadeInUp 0.8s ease-out 0.2s both;
  }

  .mobile-container .subtitle {
    font-size: 14px; /* text-sm */
    animation: fadeInUp 0.8s ease-out 0.2s both;
  }

  .mobile-container .prize-info {
    font-size: 18px; /* Уменьшено с 24px */
    color: #fbbf24;
    font-weight: bold;
    margin: 16px 0;
    animation: fadeInUp 0.8s ease-out 0.4s both;
  }

  .mobile-container .custom-button {
    position: absolute;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;
  }

  .hero-content {
    max-width: 100%;
    text-align: left;
    padding: 0 20px;
  }

  .hero-content h1 {
    font-size: 30px; /* text-3xl на мобильных */
  }

  .hero-content p {
    font-size: 18px;
  }

  .custom-button {
    padding: 10px 20px;
    font-size: 16px;
  }

  .info-section {
    margin-top: 32px; /* mt-8 - убираем отрицательный margin на мобильных */
    padding: 0 20px 40px;
  }

  .info-cards {
    flex-direction: column;
    align-items: stretch;
    gap: 16px; /* gap-4 */
  }

  .info-card {
    width: 100%;
    max-width: 100%;
    padding: 24px 20px; /* Уменьшен padding */
  }

  .info-card .el-icon {
    font-size: 32px; /* Уменьшена иконка */
  }

  .info-card h3 {
    font-size: 24px; /* Уменьшен размер */
  }

  .info-card p {
    font-size: 14px; /* text-sm */
  }

  .task-section {
    padding: 30px 24px; /* px-6 */
  }

  .task-section h2 {
    font-size: 24px;
  }

  .task-section p {
    font-size: 14px;
  }

  .stages-section {
    margin: 0;
    padding: 30px 20px; /* px-5 - единообразный padding */
    width: 100%;
  }

  .stages-section h2 {
    font-size: 24px;
  }

  .stage-item {
    padding: 16px 0; /* Упрощаем padding, только вертикальный */
    width: 100%; /* Полная ширина */
  }

  .timeline-section {
    margin: 0;
    padding: 30px 24px; /* px-6 */
  }

  /* Typography - уменьшаем заголовки */
  .stages-card h2,
  .timeline-card h2,
  .section-title {
    font-size: 24px; /* text-2xl */
    margin-bottom: 20px;
  }

  .timeline-section h2 {
    font-size: 24px;
  }

  /* Padding в карточках - убираем на мобильных для stages и results */
  .stages-card,
  .past-results-card {
    padding: 0; /* Убираем padding полностью */
    width: 100%; /* Полная ширина */
    box-sizing: border-box;
  }
  
  .timeline-card {
    padding: 20px; /* Оставляем для timeline */
    width: 100%;
    box-sizing: border-box;
  }

  /* Timeline - убираем левый отступ */
  .timeline-item::before {
    display: none; /* Убираем вертикальную линию на мобильных */
  }
  
  .timeline-item:hover {
    transform: none; /* Убираем hover эффект на мобильных */
    box-shadow: none;
  }

  .prize-info {
    font-size: 20px;
  }

  .subtitle {
    font-size: 16px;
  }

  /* Параграфы - уменьшаем размер */
  .stages-card p,
  .timeline-card p,
  .past-results-card p {
    font-size: 14px; /* text-sm */
  }
}

/* Блок результатов прошлых лет */
.past-results-section {
  padding: 48px 20px; /* py-12 */
  background: transparent; /* Прозрачный фон */
  border-radius: 0;
  margin: 0;
  width: 100%;
  position: relative;
}

@media (max-width: 767px) {
  .past-results-section {
    padding: 24px 20px; /* Уменьшаем padding, убираем лишние отступы */
    width: 100%; /* w-full */
  }
}

.past-results-card {
  background: white;
  border-radius: 16px; /* rounded-2xl */
  padding: 32px; /* p-8 */
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1); /* shadow-sm */
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

@media (max-width: 767px) {
  .past-results-card {
    background: transparent; /* bg-transparent на мобильных */
    box-shadow: none; /* shadow-none */
    border: 0; /* border-0 */
    padding: 0; /* Убираем padding */
    width: 100%; /* w-full */
  }
}

.section-title {
  text-align: center; /* Центрируем на мобильных */
  font-size: 32px; /* md:text-4xl */
  margin-bottom: 40px;
  color: #111827; /* text-gray-900 */
  font-weight: 600;
  position: relative;
}

@media (min-width: 768px) {
  .section-title {
    text-align: left; /* md:text-left на десктопе */
  }
}

.past-results-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin: 0 auto;
  position: relative;
}

.past-year-card {
  background: white;
  border-radius: 12px; /* rounded-xl */
  padding: 30px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
  transform: translateY(30px) scale(0.95);
  animation: scaleIn 0.6s ease-out forwards;
}

@media (max-width: 767px) {
  .past-year-card {
    background: transparent; /* Убираем фон */
    box-shadow: none; /* Убираем тени */
    border-radius: 0; /* Убираем скругления */
    padding: 24px 0; /* Упрощаем padding, убираем боковые */
    width: 100%; /* w-full */
  }
}

.past-year-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 12px 32px rgba(0, 163, 255, 0.2);
}

.year-badge {
  display: inline-block;
  background: linear-gradient(90deg, #00A3FF 0%, #5B51D8 100%);
  color: white;
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 163, 255, 0.3);
}

.year-winners {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.winner-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
}

@media (max-width: 767px) {
  .winner-item {
    background: transparent; /* Убираем фон */
    border-radius: 0; /* Убираем скругления */
    box-shadow: none; /* Убираем тени */
    padding: 16px 0; /* Упрощаем padding */
    border-bottom: 1px solid #e5e7eb; /* border-bottom вместо рамки */
    margin-bottom: 0;
    width: 100%; /* w-full */
  }
  
  .winner-item:last-child {
    border-bottom: 0; /* Убираем border у последнего элемента */
  }
}

.winner-item:hover {
  background: #e9ecef;
  transform: translateX(5px);
}

.winner-logo-container {
  position: relative;
  flex-shrink: 0;
}

.winner-logo {
  border: 3px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.winner-medal {
  position: absolute;
  bottom: -5px;
  right: -5px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  border: 2px solid white;
  animation: float 3s ease-in-out infinite;
}

.winner-medal .el-icon {
  color: white; /* Белый цвет для иконок на градиентном фоне медалей - это нормально */
}

.winner-medal.gold {
  background: linear-gradient(135deg, #ffd700 0%, #ffb347 100%);
}

.winner-medal.silver {
  background: linear-gradient(135deg, #C0C0C0 0%, #A9A9A9 100%);
}

.winner-medal.bronze {
  background: linear-gradient(135deg, #CD7F32 0%, #B8860B 100%);
}

.winner-info {
  flex: 1;
}

.winner-info h4 {
  margin: 0 0 5px 0;
  color: #333;
  font-size: 16px;
  font-weight: bold;
}

.winner-theme {
  margin: 0 0 5px 0;
  color: #666;
  font-size: 14px;
  font-style: italic;
}

.winner-score {
  margin: 0;
  color: #00A3FF;
  font-size: 12px;
  font-weight: bold;
}

.winners-title,
.finalists-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin: 20px 0 15px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #e9ecef;
}

.finalists-title {
  margin-top: 30px;
}

.year-finalists {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

@media (max-width: 767px) {
  .year-finalists {
    gap: 0; /* Убираем gap, используем border-bottom */
  }
}

.finalist-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 10px;
  transition: all 0.3s ease;
  border-left: 3px solid #00A3FF;
  cursor: pointer;
}

@media (max-width: 767px) {
  .finalist-item {
    background: transparent; /* Убираем фон */
    border-radius: 0; /* Убираем скругления */
    box-shadow: none; /* Убираем тени */
    border-left: 0; /* Убираем левый border */
    padding: 16px 0; /* Упрощаем padding */
    border-bottom: 1px solid #e5e7eb; /* border-bottom вместо рамки */
    margin-bottom: 0;
    width: 100%; /* w-full */
  }
  
  .finalist-item:last-child {
    border-bottom: 0; /* Убираем border у последнего элемента */
  }
}

.finalist-item:hover {
  background: #e9ecef;
  transform: translateX(5px);
  border-left-color: #5B51D8;
}

.finalist-logo-container {
  position: relative;
  flex-shrink: 0;
}

.finalist-logo {
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.finalist-info {
  flex: 1;
}

.finalist-info h4 {
  margin: 0 0 5px 0;
  color: #333;
  font-size: 15px;
  font-weight: 600;
}

.finalist-theme {
  margin: 0 0 5px 0;
  color: #666;
  font-size: 13px;
  font-style: italic;
}

.finalist-score {
  margin: 0;
  color: #00A3FF;
  font-size: 12px;
  font-weight: bold;
}

.event-name {
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
  font-style: italic;
}

.loading-past-results {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

@media (max-width: 768px) {
  .past-results-section {
    padding: 30px 24px; /* px-6 */
    margin: 0;
  }

  .section-title {
    font-size: 24px;
    margin-bottom: 30px;
  }

  .past-results-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .winners-title,
  .finalists-title {
    font-size: 18px;
    margin: 15px 0 12px 0;
  }

  .finalist-item {
    padding: 10px;
    gap: 10px;
  }

  .finalist-info h4 {
    font-size: 14px;
  }

  .finalist-theme {
    font-size: 12px;
  }

  .past-year-card {
    padding: 20px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .hero-section {
    width: 100%;
    min-height: 600px;
    margin: 0;
    margin-bottom: 0;
  }

  .hero-wrapper {
    padding: 60px 40px;
  }

  .hero-title {
    font-size: 56px;
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

  .partner-logo {
    display: none;
  }
}

@media (max-width: 768px) {
  .partner-logo {
    display: none;
  }

  .partner-logo-mobile {
    display: block;
  }
}

@media (min-width: 769px) {
  .partner-logo-mobile {
    display: none;
  }

  .hero-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
}

/* Стили для модального окна с информацией о команде */
/* Фиксированная высота модального окна на ПК */
@media (min-width: 769px) {
  :deep(.team-details-dialog) {
    overflow: hidden;
  }

  :deep(.team-details-dialog .el-dialog__wrapper) {
    overflow: hidden;
  }

  :deep(.team-details-dialog .el-dialog) {
    display: flex;
    flex-direction: column;
    max-height: 80vh;
    max-width: 90vw;
    width: 600px !important;
    margin: 5vh auto !important;
    box-sizing: border-box;
  }

  :deep(.team-details-dialog .el-dialog__body) {
    max-height: 70vh;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 20px;
    word-wrap: break-word;
  }

  :deep(.team-details-dialog .el-dialog__header) {
    flex-shrink: 0;
    padding: 20px 20px 10px;
    overflow: hidden;
  }

  :deep(.team-details-dialog .el-dialog__footer) {
    flex-shrink: 0;
    padding: 10px 20px 20px;
  }
}

/* Стили для мобильных устройств */
@media (max-width: 768px) {
  :deep(.team-details-dialog) {
    overflow: hidden;
  }

  :deep(.team-details-dialog .el-dialog__wrapper) {
    overflow: hidden;
  }

  :deep(.team-details-dialog .el-dialog) {
    margin: 0 !important;
    width: 100% !important;
    max-width: 100vw !important;
    height: 100vh !important;
    max-height: 100vh !important;
    border-radius: 0;
    left: 0 !important;
    top: 0 !important;
    transform: none !important;
    box-sizing: border-box;
  }

  :deep(.team-details-dialog .el-dialog__header) {
    padding: 16px;
    flex-shrink: 0;
    border-bottom: 1px solid #ebeef5;
    overflow: hidden;
    word-wrap: break-word;
  }

  :deep(.team-details-dialog .el-dialog__body) {
    padding: 16px;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    max-height: calc(100vh - 120px);
    word-wrap: break-word;
  }

  :deep(.team-details-dialog .el-dialog__footer) {
    padding: 12px 16px;
    flex-shrink: 0;
    border-top: 1px solid #ebeef5;
  }

  .team-details {
    padding: 0;
  }

  .team-details-header {
    flex-direction: column;
    text-align: center;
    gap: 12px;
    margin-bottom: 20px;
    padding-bottom: 16px;
  }

  .team-details-title h3 {
    font-size: 20px;
  }

  .team-motto-detail {
    font-size: 13px;
  }

  .team-details-content {
    gap: 20px;
    max-width: 100%;
    overflow-x: hidden;
  }

  .team-details-header {
    max-width: 100%;
    overflow-x: hidden;
  }

  .members-list {
    max-width: 100%;
    overflow-x: hidden;
  }

  .member-item {
    max-width: 100%;
    overflow-x: hidden;
    word-wrap: break-word;
    word-break: break-word;
  }

  .member-name,
  .member-vuz {
    word-wrap: break-word;
    word-break: break-word;
    overflow-wrap: break-word;
  }

  .team-details-title h3,
  .team-motto-detail {
    word-wrap: break-word;
    word-break: break-word;
    overflow-wrap: break-word;
  }

  .members-section h4,
  .score-section h4 {
    font-size: 15px;
    margin-bottom: 10px;
  }

  .member-item {
    padding: 10px;
    gap: 10px;
  }

  .member-icon {
    font-size: 20px;
  }

  .member-name {
    font-size: 14px;
  }

  .member-role,
  .member-vuz {
    font-size: 12px;
  }

  .score-section .score-value {
    font-size: 28px;
  }
}

.team-details {
  padding: 0;
  max-width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
}

.team-details * {
  box-sizing: border-box;
  max-width: 100%;
}

.team-details-title h3,
.team-motto-detail,
.member-name,
.member-vuz {
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
}

.team-details-header {
  display: flex;
    align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}

.team-details-title h3 {
  margin: 0 0 8px 0;
  font-size: 24px;
  color: #333;
}

.team-motto-detail {
  margin: 0;
  color: #666;
  font-style: italic;
  font-size: 14px;
}

.team-details-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.members-section h4,
.score-section h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #333;
  font-weight: 600;
}

.members-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.member-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
}

.member-icon {
  font-size: 24px;
  color: #409EFF;
}

.member-info {
  flex: 1;
}

.member-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.member-role {
  color: #666;
  font-size: 14px;
  margin-bottom: 4px;
}

.member-vuz {
  color: #909399;
  font-size: 12px;
}

.score-section .score-value {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
}

@media (max-width: 768px) {
  .team-details-header {
    flex-direction: column;
    text-align: center;
  }
}
</style>
