<template>
  <!-- Секция финалистов / участников очного этапа -->
  <div class="winners-section finalists-section" v-if="showTeamsList && !stageStore.shouldShowWinners">
    <h2>{{ teamsListTitle }}</h2>
    
    <!-- Топ-4 финалиста -->
    <div class="finalists-list" v-if="topFinalists.length > 0">
      <div
        v-for="(team, index) in topFinalists"
        :key="team.team_id || index"
        class="finalist-card animate-card"
        :style="{ animationDelay: `${index * 0.1}s` }"
        @click="openTeamDetails(team)"
      >
        <div class="finalist-rank" aria-hidden="true"></div>
        <el-avatar
          :size="isMobile ? 44 : 60"
          :src="getTeamLogoUrl(team)"
          :alt="team.team_name"
          class="finalist-avatar"
        />
        <div class="finalist-info">
          <h3 class="finalist-name">{{ team.team_name }}</h3>
          <p v-if="team.team_motto" class="finalist-motto">{{ team.team_motto }}</p>
          <p v-if="showScores && team.total_score !== undefined" class="finalist-score">
            Балл: {{ Math.round(team.total_score) }}
          </p>
          <div v-if="team.vuz_list && team.vuz_list.length > 0" class="finalist-vuz">
            <el-tag
              v-for="(vuz, vuzIndex) in team.vuz_list"
              :key="vuzIndex"
              type="info"
              size="small"
            >
              {{ vuz }}
            </el-tag>
          </div>
        </div>
        <el-icon v-if="!isMobile" class="finalist-arrow">
          <ArrowRight/>
        </el-icon>
      </div>
    </div>

    <!-- Оставшиеся команды — только на этапе определения финалистов -->
    <div class="remaining-teams-section" v-if="stageStore.shouldShowFinalists && remainingTeams.length > 0">
      <h3 class="remaining-teams-title">Оставшиеся команды</h3>
      <div class="remaining-teams-list">
        <div
          v-for="(team, index) in remainingTeams"
          :key="team.team_id || index"
          class="remaining-team-card animate-card"
          :style="{ animationDelay: `${(topFinalists.length + index) * 0.1}s` }"
          @click="openTeamDetails(team)"
        >
          <el-avatar
            :size="50"
            :src="getTeamLogoUrl(team)"
            :alt="team.team_name"
            class="remaining-team-avatar"
          />
          <div class="remaining-team-info">
            <h4 class="remaining-team-name">{{ team.team_name }}</h4>
            <p v-if="team.team_motto" class="remaining-team-motto">{{ team.team_motto }}</p>
            <p v-if="team.total_score !== undefined" class="remaining-team-score">
              Балл: {{ Math.round(team.total_score) }}
            </p>
          </div>
          <el-icon class="remaining-team-arrow">
            <ArrowRight/>
          </el-icon>
        </div>
      </div>
    </div>
  </div>

  <!-- Секция победителей -->
  <div class="winners-section winners-section-final" v-if="stageStore.shouldShowWinners">
    <h2>Победители хакатона</h2>
    <div class="podium-container">
      <!-- Второе место -->
      <div 
        class="podium-place second-place animate-podium" 
        :style="{ animationDelay: '0.2s' }"
        @click="openTeamDetails(secondPlace)"
        @mouseenter="handlePodiumHover"
        @mouseleave="handlePodiumLeave"
      >
        <div class="team-logo-container">
          <img :src="getTeamLogoUrl(secondPlace)"
               :alt="`Логотип команды ${secondPlace?.team_name || 'Второе место'}`"
               class="team-logo"
          >
          <div class="medal silver">
            <el-icon>
              <Medal/>
            </el-icon>
          </div>
        </div>
        <div class="podium-block">2</div>
        <div class="team-info">
          <h3>{{ secondPlace?.team_name || 'Второе место' }}</h3>
          <p class="team-motto" v-if="secondPlace?.team_motto">{{ secondPlace.team_motto }}</p>
          <p class="score" v-if="secondPlace">
            Итоговый балл: {{ formatScore(secondPlace.total_score) }}
          </p>
        </div>
      </div>

      <!-- Первое место -->
      <div 
        class="podium-place first-place animate-podium" 
        :style="{ animationDelay: '0s' }"
        @click="openTeamDetails(firstPlace)"
        @mouseenter="handlePodiumHover"
        @mouseleave="handlePodiumLeave"
      >
        <div class="team-logo-container">
          <img :src="getTeamLogoUrl(firstPlace)"
               :alt="`Логотип команды ${firstPlace?.team_name || 'Первое место'}`"
               class="team-logo"
          >
          <div class="medal gold">
            <el-icon>
              <Trophy/>
            </el-icon>
          </div>
        </div>
        <div class="podium-block">1</div>
        <div class="team-info">
          <h3>{{ firstPlace?.team_name || 'Первое место' }}</h3>
          <p class="team-motto" v-if="firstPlace?.team_motto">{{ firstPlace.team_motto }}</p>
          <p class="score" v-if="firstPlace">
            Итоговый балл: {{ formatScore(firstPlace.total_score) }}
          </p>
        </div>
      </div>

      <!-- Третье место -->
      <div 
        class="podium-place third-place animate-podium" 
        :style="{ animationDelay: '0.4s' }"
        @click="openTeamDetails(thirdPlace)"
        @mouseenter="handlePodiumHover"
        @mouseleave="handlePodiumLeave"
      >
        <div class="team-logo-container">
          <img :src="getTeamLogoUrl(thirdPlace)"
               :alt="`Логотип команды ${thirdPlace?.team_name || 'Третье место'}`"
               class="team-logo"
          >
          <div class="medal bronze">
            <el-icon>
              <Medal/>
            </el-icon>
          </div>
        </div>
        <div class="podium-block">3</div>
        <div class="team-info">
          <h3>{{ thirdPlace?.team_name || 'Третье место' }}</h3>
          <p class="team-motto" v-if="thirdPlace?.team_motto">{{ thirdPlace.team_motto }}</p>
          <p class="score" v-if="thirdPlace">
            Итоговый балл: {{ formatScore(thirdPlace.total_score) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Таблица остальных команд -->
    <div class="other-teams-container" v-if="otherTeams.length > 0">
      <h3>Остальные участники</h3>
      <el-table
        :data="otherTeams"
        style="width: 100%"
        :default-sort="{ prop: 'total_score', order: 'descending' }"
        @row-click="(row) => openTeamDetails(row)"
      >
        <el-table-column
          label="Место"
          width="80"
          align="center"
        >
          <template #default="scope">
            {{ scope.$index + 4 }}
          </template>
        </el-table-column>

        <el-table-column
          label="Команда"
          min-width="200"
        >
          <template #default="scope">
            <div class="team-cell">
              <el-avatar
                :size="40"
                :src="getTeamLogoUrl(scope.row)"
                :alt="scope.row.team_name"
              />
              <div class="team-info-cell">
                <div class="team-name">{{ scope.row.team_name }}</div>
                <div class="team-motto-cell">{{ scope.row.team_motto }}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          prop="total_score"
          label="Итоговый балл"
          width="120"
          align="center"
        >
          <template #default="scope">
            {{ formatScore(scope.row.total_score) }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

  <!-- Модальное окно с информацией о команде -->
  <el-dialog
    v-model="teamDetailsVisible"
    :title="selectedTeam?.team_name || 'Информация о команде'"
    :width="isMobile ? '95%' : '600px'"
    :close-on-click-modal="true"
    class="team-details-dialog"
    :fullscreen="isMobile"
    lock-scroll
  >
    <div v-if="selectedTeam" class="team-details">
      <div class="team-details-header">
        <el-avatar
          :size="80"
          :src="getTeamLogoUrl(selectedTeam)"
          :alt="selectedTeam.team_name"
        />
        <div class="team-details-title">
          <h3>{{ selectedTeam.team_name }}</h3>
          <p v-if="selectedTeam.team_motto" class="team-motto-detail">{{ selectedTeam.team_motto }}</p>
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

        <div v-if="showScores && selectedTeam.total_score !== undefined" class="score-section">
          <h4>Итоговый балл:</h4>
          <div class="score-value">{{ formatScore(selectedTeam.total_score) }}</div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from 'vue'
import { Trophy, Medal, User, ArrowRight } from '@element-plus/icons-vue'
import { teamsApi } from '@/api/teams'
import { useStageStore } from '@/stores/stage'
import { useAuthStore } from "@/stores/auth.js"
import { useLockPageScroll } from '@/composables/useLockPageScroll'

const authStore = useAuthStore()
const stageStore = useStageStore()
const firstPlace = ref(null)
const secondPlace = ref(null)
const thirdPlace = ref(null)
const allTeams = ref([])
const finalists = ref([]) // Топ-4 финалиста
const remainingTeams = ref([]) // Оставшиеся команды
const teamDetailsVisible = ref(false)
const selectedTeam = ref(null)
const isMobile = ref(typeof window !== 'undefined' && window.innerWidth <= 768)

const updateIsMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

useLockPageScroll(teamDetailsVisible)

// Вычисляемое свойство для остальных команд (с 4-го места)
const otherTeams = computed(() => {
  return allTeams.value.slice(3)
})

// Топ-4 финалиста для отображения списком
const topFinalists = computed(() => {
  return finalists.value.slice(0, 4)
})

const showTeamsList = computed(() => {
  return stageStore.shouldShowFinalists || stageStore.shouldShowOnSiteParticipants
})

const teamsListTitle = computed(() => {
  return stageStore.shouldShowOnSiteParticipants
    ? 'Участники очного этапа'
    : 'Финалисты хакатона'
})

const showScores = computed(() => !stageStore.shouldShowOnSiteParticipants)

// Функция для форматирования оценки
const formatScore = (score) => {
  return score ? Math.round(score * 10) / 10 : 0
}

// Функция для получения URL логотипа команды
const getTeamLogoUrl = (team) => {
  if (!team) return '/placeholder-logo.png'
  
  const teamId = team.team_id || team.id
  return teamId ?
    `${import.meta.env.VITE_API_URL}/teams/${teamId}/logo` :
    '/placeholder-logo.png'
}

// Функция для загрузки финалистов
const loadFinalists = async () => {
  try {
    const response = await teamsApi.getFinalists()
    // API теперь возвращает объект с finalists и remaining_teams
    if (response.finalists) {
      finalists.value = response.finalists
      remainingTeams.value = stageStore.shouldShowFinalists
        ? (response.remaining_teams || [])
        : []
    } else {
      // Fallback для старого формата (массив)
      finalists.value = Array.isArray(response) ? response : []
      remainingTeams.value = []
    }
    
    // Берем первые 3 команды для пьедестала (если нужно)
    if (finalists.value.length > 0) firstPlace.value = finalists.value[0]
    if (finalists.value.length > 1) secondPlace.value = finalists.value[1]
    if (finalists.value.length > 2) thirdPlace.value = finalists.value[2]
  } catch (error) {
    console.error('Ошибка при получении финалистов:', error)
    finalists.value = []
    remainingTeams.value = []
  }
}

// Функция для загрузки победителей
const loadWinners = async () => {
  try {
    const winners = await teamsApi.getWinners()
    allTeams.value = winners // Сохраняем все команды
    if (winners.length > 0) firstPlace.value = winners[0]
    if (winners.length > 1) secondPlace.value = winners[1]
    if (winners.length > 2) thirdPlace.value = winners[2]
  } catch (error) {
    console.error('Ошибка при получении победителей:', error)
  }
}

// Открытие модального окна с информацией о команде
const openTeamDetails = async (team) => {
  if (!team) return
  
  // Если у команды уже есть полная информация (members, vuz_list), используем её
  if (team.members && team.vuz_list) {
    selectedTeam.value = team
    teamDetailsVisible.value = true
    // Сбрасываем скролл модального окна в начало
    await nextTick()
    resetDialogScroll()
    return
  }
  
  // Иначе загружаем информацию о команде через публичный endpoint
  try {
    const teamId = team.team_id || team.id
    if (!teamId) {
      console.error('Не удалось определить ID команды')
      return
    }
    
    // Загружаем полную информацию о команде через публичный endpoint
    const teamInfo = await teamsApi.getPublicTeamInfo(teamId)
    
    // Объединяем данные команды с загруженной информацией
    selectedTeam.value = {
      ...team,
      ...teamInfo,
      // Сохраняем total_score из исходных данных, если его нет в teamInfo
      total_score: teamInfo.total_score || team.total_score
    }
    
    teamDetailsVisible.value = true
    // Сбрасываем скролл модального окна в начало
    await nextTick()
    resetDialogScroll()
  } catch (error) {
    console.error('Ошибка при загрузке информации о команде:', error)
    // В случае ошибки показываем хотя бы базовую информацию
    selectedTeam.value = team
    teamDetailsVisible.value = true
    // Сбрасываем скролл модального окна в начало
    await nextTick()
    resetDialogScroll()
  }
}

// Функция для сброса скролла модального окна
const resetDialogScroll = () => {
  const dialogBody = document.querySelector('.team-details-dialog .el-dialog__body')
  if (dialogBody) {
    dialogBody.scrollTop = 0
  }
}

// Вспомогательные функции для отображения ролей
const getRoleDisplayName = (role) => {
  if (!role) return 'Участник'
  const roleLower = role.toLowerCase()
  switch (roleLower) {
    case 'teamlead': return 'Капитан'
    case 'mentor': return 'Наставник'
    case 'member': return 'Участник'
    default: return role
  }
}

// Обработчики hover для пьедестала
const handlePodiumHover = (event) => {
  const podiumPlace = event.currentTarget
  podiumPlace.style.transform = 'translateY(-15px) scale(1.05)'
  podiumPlace.style.zIndex = '10'
}

const handlePodiumLeave = (event) => {
  const podiumPlace = event.currentTarget
  podiumPlace.style.transform = 'translateY(0) scale(1)'
  podiumPlace.style.zIndex = '1'
}

// Следим за изменением этапа
watch(
  [
    () => stageStore.shouldShowFinalists,
    () => stageStore.shouldShowOnSiteParticipants,
    () => stageStore.shouldShowWinners,
    () => authStore.isAdmin
  ],
  ([showFinalists, showOnSiteParticipants, showWinners, isAdmin]) => {
    if (showFinalists || showOnSiteParticipants || (isAdmin && !showWinners)) {
      loadFinalists()
    } else if (showWinners || isAdmin) {
      loadWinners()
    } else {
      // Очищаем данные
      firstPlace.value = null
      secondPlace.value = null
      thirdPlace.value = null
      allTeams.value = []
      finalists.value = []
      remainingTeams.value = []
    }
  }
)

// Сбрасываем скролл при открытии модального окна
watch(teamDetailsVisible, (isVisible) => {
  if (isVisible) {
    nextTick(() => {
      resetDialogScroll()
    })
  }
})

onMounted(async () => {
  window.addEventListener('resize', updateIsMobile)
  if (stageStore.shouldShowFinalists || stageStore.shouldShowOnSiteParticipants || (authStore.isAdmin && !stageStore.shouldShowWinners)) {
    await loadFinalists()
  } else if (stageStore.shouldShowWinners || authStore.isAdmin) {
    await loadWinners()
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile)
})
</script>

<style scoped>
.score {
  font-size: 16px;
  color: #666;
  margin-top: 8px;
  font-weight: bold;
}

.team-motto {
  font-size: 14px;
  color: #666;
  margin: 4px 0;
  font-style: italic;
  max-height: 60px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #888 transparent;
}

.team-motto::-webkit-scrollbar {
  width: 4px;
}

.team-motto::-webkit-scrollbar-track {
  background: transparent;
}

.team-motto::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 4px;
}

.team-motto::-webkit-scrollbar-thumb:hover {
  background-color: #666;
}

.winners-section {
  padding: 60px 20px;
  background: transparent;
  margin: 20px;
}

.winners-section h2 {
  text-align: center;
  font-size: 32px;
  margin-bottom: 40px;
  color: #111827;
  font-weight: 600;
}

/* Карточка для секции финалистов/победителей в стиле таймлайна */
.winners-section-final,
.finalists-section {
  max-width: 1200px;
  margin: 0 auto 40px;
}

.finalists-list,
.podium-container,
.other-teams-container {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
}

.podium-container {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 20px;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  padding-bottom: 220px;
}

.podium-place {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 250px;
  position: relative;
  cursor: pointer;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease, z-index 0.3s ease;
  z-index: 1;
}

.podium-place:hover {
  transform: translateY(-15px) scale(1.05);
  z-index: 10;
}

.podium-place:hover .podium-block {
  box-shadow: 0 -8px 25px rgba(0, 0, 0, 0.2);
}

/* Анимация появления пьедестала */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-podium {
  animation: slideUp 0.8s ease-out forwards;
  opacity: 0;
}

.team-logo-container {
  position: relative;
  margin-bottom: 20px;
}

.team-logo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.podium-place:hover .team-logo {
  transform: scale(1.15);
}

.medal {
  position: absolute;
  bottom: -10px;
  right: -10px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.podium-place:hover .medal {
  transform: scale(1.2) rotate(10deg);
}

.gold {
  background: linear-gradient(135deg, #ffd700 0%, #ffb347 100%);
}

.silver {
  background: linear-gradient(135deg, #C0C0C0 0%, #A9A9A9 100%);
}

.bronze {
  background: linear-gradient(135deg, #CD7F32 0%, #B8860B 100%);
}

.podium-block {
  width: 100%;
  background: white;
  border-radius: 8px 8px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: bold;
  color: #333;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.first-place .podium-block {
  height: 160px;
}

.second-place .podium-block {
  height: 120px;
}

.third-place .podium-block {
  height: 80px;
}

.team-info {
  text-align: center;
  margin-top: 20px;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  padding: 0 10px;
}

.team-info h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 8px;
  font-weight: bold;
}

.other-teams-container {
  margin-top: 60px;
  padding: 0 20px;
}

.other-teams-container h3 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.team-cell {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.team-info-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.team-name {
  font-weight: bold;
  color: #333;
}

.team-motto-cell {
  font-size: 12px;
  color: #666;
  font-style: italic;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
}

/* Стили для модального окна */
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
    max-width: 100%;
    overflow-x: hidden;
  }

  .team-details-title h3 {
    font-size: 20px;
    word-wrap: break-word;
    word-break: break-word;
    overflow-wrap: break-word;
  }

  .team-motto-detail {
    font-size: 13px;
    word-wrap: break-word;
    word-break: break-word;
    overflow-wrap: break-word;
  }

  .team-details-content {
    gap: 20px;
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
    padding: 10px;
    gap: 10px;
  }

  .member-icon {
    font-size: 20px;
  }

  .member-name {
    font-size: 14px;
    word-wrap: break-word;
    word-break: break-word;
    overflow-wrap: break-word;
  }

  .member-role,
  .member-vuz {
    font-size: 12px;
    word-wrap: break-word;
    word-break: break-word;
    overflow-wrap: break-word;
  }

  .members-section h4,
  .score-section h4 {
    font-size: 15px;
    margin-bottom: 10px;
  }

  .score-value {
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
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.member-vuz {
  font-size: 12px;
  color: #666;
}

.score-value {
  font-size: 32px;
  font-weight: bold;
  color: #409EFF;
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%);
  border-radius: 8px;
}

@media (max-width: 768px) {
  .podium-container {
    flex-direction: column;
    align-items: center;
    gap: 240px;
    padding-bottom: 220px;
  }

  .podium-place {
    width: 100%;
    max-width: 280px;
  }

  .first-place {
    order: -1;
  }

  .podium-block {
    height: 80px !important;
  }

  .team-logo {
    width: 80px;
    height: 80px;
  }

  .medal {
    width: 32px;
    height: 32px;
  }

  .winners-section {
    padding: 40px 15px;
    margin: 10px;
  }

  .winners-section h2 {
    font-size: 24px;
    margin-bottom: 30px;
  }

  .other-teams-container {
    margin-top: 40px;
    padding: 0 10px;
  }

  .team-motto-cell {
    max-width: 150px;
  }

  .team-details-header {
    flex-direction: column;
    text-align: center;
  }
}

:deep(.el-table) {
  --el-table-border-color: #dcdfe6;
  --el-table-header-bg-color: #f5f7fa;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

:deep(.el-table th) {
  background-color: #f5f7fa;
  font-weight: bold;
}

:deep(.el-table--enable-row-hover .el-table__body tr:hover > td) {
  background-color: #f5f7fa;
  cursor: pointer;
}

/* Стили для списка финалистов */
.finalists-list {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.finalist-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.finalist-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(135deg, #409EFF 0%, #66b1ff 100%);
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.finalist-card:hover {
  transform: translateX(10px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.finalist-card:hover::before {
  transform: scaleY(1);
}

.finalist-rank {
  font-size: 32px;
  font-weight: bold;
  color: #409EFF;
  min-width: 50px;
  text-align: center;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.finalist-card:hover .finalist-rank {
  opacity: 1;
  transform: scale(1.1);
}

.finalist-avatar {
  flex-shrink: 0;
  border: 3px solid #f0f0f0;
  transition: all 0.3s ease;
}

.finalist-card:hover .finalist-avatar {
  border-color: #409EFF;
  transform: scale(1.1);
}

.finalist-info {
  flex: 1;
  min-width: 0;
}

.finalist-name {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.finalist-motto {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #666;
  font-style: italic;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.finalist-score {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #409EFF;
}

.finalist-vuz {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.finalist-arrow {
  font-size: 24px;
  color: #c0c4cc;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.finalist-card:hover .finalist-arrow {
  color: #409EFF;
  transform: translateX(5px);
}

/* Стили для секции оставшихся команд */
.remaining-teams-section {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 2px solid #e4e7ed;
}

.remaining-teams-title {
  font-size: 20px;
  font-weight: 600;
  color: #606266;
  margin-bottom: 20px;
  text-align: center;
}

.remaining-teams-list {
  max-width: 900px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.remaining-team-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.remaining-team-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.remaining-team-avatar {
  flex-shrink: 0;
  border: 2px solid #e4e7ed;
  transition: all 0.3s ease;
}

.remaining-team-card:hover .remaining-team-avatar {
  border-color: #409EFF;
}

.remaining-team-info {
  flex: 1;
  min-width: 0;
}

.remaining-team-name {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.remaining-team-motto {
  margin: 0 0 4px 0;
  font-size: 12px;
  color: #909399;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.remaining-team-score {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #409EFF;
}

.remaining-team-arrow {
  font-size: 20px;
  color: #c0c4cc;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.remaining-team-card:hover .remaining-team-arrow {
  color: #409EFF;
  transform: translateX(5px);
}

@media (max-width: 768px) {
  .remaining-teams-list {
    grid-template-columns: 1fr;
  }

  .finalist-rank {
    display: none;
  }

  .finalist-card {
    gap: 12px;
    padding: 14px 12px;
    align-items: flex-start;
  }

  .finalist-card:hover {
    transform: none;
  }

  .finalist-name {
    font-size: 16px;
    margin-bottom: 4px;
    overflow-wrap: anywhere;
  }

  .finalist-motto {
    font-size: 12px;
    white-space: normal;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .finalist-vuz {
    width: 100%;
  }

  .finalist-vuz :deep(.el-tag) {
    max-width: 100%;
    height: auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .winners-section.finalists-section {
    padding: 24px 12px;
    margin: 0;
  }
}

/* Анимация появления карточек финалистов */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-card {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}
</style>
