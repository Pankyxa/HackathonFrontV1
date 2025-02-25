<template>
  <TheHeader></TheHeader>
  <div class="judge-teams-container">
    <h1>Страница жюри</h1>
    <div class="teams-grid">
      <div v-for="team in teams" :key="team.id" class="team-card" @click="navigateToTeam(team.id)">
        <div class="team-logo">
          <img v-if="team.logo_file_id" :src="`${apiUrl}/teams/${team.id}/logo`" alt="Team Logo" />
          <div v-else class="logo-placeholder"></div>
        </div>
        <div class="team-info">
          <h3>{{ team.team_name }}</h3>
          <p>{{ team.team_motto }}</p>
        </div>
      </div>
    </div>
  </div>
  <TheFooter></TheFooter>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import TheHeader from "@/components/TheHeader.vue"
import TheFooter from "@/components/TheFooter.vue"
import { teamsApi } from '@/api/teams'

const router = useRouter()
const teams = ref([])
const apiUrl = import.meta.env.VITE_API_URL

const navigateToTeam = (teamId) => {
  router.push(`/judge/teams/${teamId}`)
}

onMounted(async () => {
  try {
    const teamsData = await teamsApi.getAllTeams() // тут нужен метод на получение команд для жюри
    teams.value = teamsData
  } catch (error) {
    console.error('Error loading mentor teams:', error)
  }
})
</script>

<style scoped>
.judge-teams-container {
  margin: 105px 20px 20px;
  min-height: calc(100vh - 316px);
}

h1 {
  margin-bottom: 2rem;
  color: #333333;
}

.teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
}

.team-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  gap: 1rem;
  align-items: center;
}

.team-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.team-logo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.team-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.logo-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #00A3FF 0%, #5B51D8 100%);
}

.team-info {
  flex: 1;
}

.team-info h3 {
  margin: 0 0 0.5rem;
  color: #333333;
}

.team-info p {
  margin: 0;
  color: #333333;
  font-size: 0.9rem;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .teams-grid {
    grid-template-columns: 1fr;
  }
}
</style>