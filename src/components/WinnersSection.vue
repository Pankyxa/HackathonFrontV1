<template>
  <div class="winners-section">
    <h2>Победители хакатона</h2>
    <div class="podium-container">
      <!-- Второе место -->
      <div class="podium-place second-place">
        <div class="team-logo-container">
          <img :src="secondPlace.logo || '/placeholder-logo.png'" alt="Логотип команды" class="team-logo">
          <div class="medal silver">
            <el-icon><Medal /></el-icon>
          </div>
        </div>
        <div class="podium-block">2</div>
        <div class="team-info">
          <h3>{{ secondPlace.team_name || 'Второе место' }}</h3>
          <p>{{ secondPlace.team_motto || 'Девиз командыДевиз командыДевиз командыДевиз командыДевиз командыДевиз командыДевиз командыДевиз командыДевиз командыДевиз командыДевиз командыДевиз командыДевиз командыДевиз командыДевиз командыДевиз командыДевиз командыДевиз командыДевиз командыДевиз командыДевиз командыДевиз командыДевиз командыДевиз командыДевиз команды' }}</p>
        </div>
      </div>

      <!-- Первое место -->
      <div class="podium-place first-place">
        <div class="team-logo-container">
          <img :src="firstPlace.logo || '/placeholder-logo.png'" alt="Логотип команды" class="team-logo">
          <div class="medal gold">
            <el-icon><Trophy /></el-icon>
          </div>
        </div>
        <div class="podium-block">1</div>
        <div class="team-info">
          <h3>{{ firstPlace.team_name || 'Первое место' }}</h3>
          <p>{{ firstPlace.team_motto || 'Девиз команды' }}</p>
        </div>
      </div>

      <!-- Третье место -->
      <div class="podium-place third-place">
        <div class="team-logo-container">
          <img :src="thirdPlace.logo || '/placeholder-logo.png'" alt="Логотип команды" class="team-logo">
          <div class="medal bronze">
            <el-icon><Medal /></el-icon>
          </div>
        </div>
        <div class="podium-block">3</div>
        <div class="team-info">
          <h3>{{ thirdPlace.team_name || 'Третье место' }}</h3>
          <p>{{ thirdPlace.team_motto || 'Девиз команды' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Trophy, Medal } from '@element-plus/icons-vue'
import { teamsApi } from '@/api/teams'

//todo: сделать апи для получения победителей

const firstPlace = ref({})
const secondPlace = ref({})
const thirdPlace = ref({})

// Здесь можно добавить логику получения победителей
// Например, через специальный API-endpoint
onMounted(async () => {
  try {
    // Пример получения команд
    // const winners = await teamsApi.getWinners()
    // firstPlace.value = winners[0]
    // secondPlace.value = winners[1]
    // thirdPlace.value = winners[2]
  } catch (error) {
    console.error('Ошибка при получении победителей:', error)
  }
})
</script>

<style scoped>
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
  padding-bottom: 220px; /* Добавляем отступ снизу для текста */
}

.podium-place {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 250px;
  position: relative; /* Добавляем relative позиционирование */
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
  position: absolute; /* Делаем абсолютное позиционирование */
  top: 100%; /* Размещаем под подиумом */
  left: 0;
  right: 0;
  padding: 0 10px; /* Добавляем отступы по бокам */
}

.team-info h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 8px;
  font-weight: bold;
}

.team-info p {
  font-size: 14px;
  color: #666;
  margin: 0;
  max-height: 200px; /* Ограничиваем максимальную высоту */
  overflow-y: auto; /* Добавляем скролл при необходимости */
}

@media (max-width: 768px) {
  .podium-container {
    flex-direction: column;
    align-items: center;
    gap: 240px; /* Увеличиваем gap для мобильной версии */
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
}
</style>