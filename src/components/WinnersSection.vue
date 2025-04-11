<template>
  <div class="winners-section" v-if="stageStore.isResultsPublication || authStore.isAdmin">
    <h2>Победители хакатона</h2>
    <div class="podium-container">
      <!-- Второе место -->
      <div class="podium-place second-place">
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
      <div class="podium-place first-place">
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
      <div class="podium-place third-place">
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

    <!-- Добавляем таблицу остальных команд -->
    <div class="other-teams-container" v-if="otherTeams.length > 0">
      <h3>Остальные участники</h3>
      <el-table
        :data="otherTeams"
        style="width: 100%"
        :default-sort="{ prop: 'total_score', order: 'descending' }"
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
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { Trophy, Medal } from '@element-plus/icons-vue'
import { teamsApi } from '@/api/teams'
import { useStageStore } from '@/stores/stage'
import {useAuthStore} from "@/stores/auth.js";

const authStore = useAuthStore()
const stageStore = useStageStore()
const firstPlace = ref(null)
const secondPlace = ref(null)
const thirdPlace = ref(null)
const allTeams = ref([])

// Вычисляемое свойство для остальных команд (с 4-го места)
const otherTeams = computed(() => {
  return allTeams.value.slice(3)
})

// Функция для форматирования оценки
const formatScore = (score) => {
  return score ? Math.round(score * 10) / 10 : 0
}

// Функция для получения URL логотипа команды
const getTeamLogoUrl = (team) => {
  return team?.team_id ?
    `${import.meta.env.VITE_API_URL}/teams/${team.team_id}/logo` :
    '/placeholder-logo.png'
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

// Следим за изменением этапа или статуса админа
watch(
  [() => stageStore.isResultsPublication, () => authStore.isAdmin],
  ([isResultsStage, isAdmin]) => {
    if (isResultsStage || isAdmin) {
      loadWinners()
    } else {
      // Очищаем данные, если не этап результатов и не админ
      firstPlace.value = null
      secondPlace.value = null
      thirdPlace.value = null
      allTeams.value = []
    }
  }
)

onMounted(async () => {
  if (stageStore.isResultsPublication || authStore.isAdmin) {
    await loadWinners()
  }
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
  max-height: 60px; /* Максимальная высота для 3 строк текста */
  overflow-y: auto;
  scrollbar-width: thin; /* Для Firefox */
  scrollbar-color: #888 transparent; /* Для Firefox */
}

/* Стили для скроллбара (Webkit browsers - Chrome, Safari, etc) */
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

/* Остальные стили остаются без изменений */
.winners-section {
  padding: 60px 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%);
  border-radius: 16px;
  margin: 20px;
}

  .winners-section h2 {
  text-align: center;
  font-size: 32px;
  margin-bottom: 40px;
  color: #333;
  font-weight: bold;
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

/* Добавляем новые стили для таблицы */
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
}
</style>