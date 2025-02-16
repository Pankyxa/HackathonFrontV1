<template>
  <TheHeader></TheHeader>
  <div class="my-team-container">
    <div class="team-page">
      <div class="team-sidebar">
        <div class="sidebar-menu">
          <div
            class="menu-item team-header-item"
            :class="{ active: activeTab === 'info' }"
            @click="activeTab = 'info'"
          >
            <img
              v-if="teamLogo"
              :src="teamLogoUrl"
              alt="Team Logo"
              class="menu-logo"
            />
            <div v-else class="menu-logo-placeholder"></div>
            <span class="team-name">{{ teamName || 'Моя команда' }}</span>
          </div>
          <div
            v-for="item in menuItems"
            :key="item.id"
            class="menu-item"
            :class="{ active: activeTab === item.id }"
            @click="activeTab = item.id"
          >
            {{ item.title }}
          </div>
        </div>
      </div>
      <div class="content-area">
        <div class="content-wrapper">
          <component
            :is="currentComponent"
            @update:teamInfo="handleTeamInfoUpdate"
          ></component>
        </div>
      </div>
    </div>
  </div>
  <TheFooter></TheFooter>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TheHeader from "@/components/TheHeader.vue"
import TheFooter from "@/components/TheFooter.vue"
import TeamInfo from '@/components/team/TeamInfo.vue'
import TeamMembers from '@/components/team/TeamMembers.vue'
import { teamsApi } from '@/api/teams'

const activeTab = ref('info')
const teamName = ref('')
const teamLogo = ref(null)
const teamId = ref(null)
const teamLogoTimestamp = ref(Date.now())

const menuItems = [
  {id: 'members', title: 'Участники'},
  {id: 'task', title: 'Задача'},
  {id: 'examples', title: 'Примеры сайтов'}
]

const teamLogoUrl = computed(() => {
  if (!teamLogo.value) return null;
  return `${teamLogo.value}?t=${teamLogoTimestamp.value}`;
})

const currentComponent = computed(() => {
  switch (activeTab.value) {
    case 'info':
      return TeamInfo
    case 'members':
      return TeamMembers
    default:
      return null
  }
})

const handleTeamInfoUpdate = (info) => {
  teamName.value = info.team_name
  teamId.value = info.id

  if (info.logo_file_id) {
    teamLogo.value = `${import.meta.env.VITE_API_URL}/teams/${info.id}/logo`
    if (info.logo_updated_at) {
      teamLogoTimestamp.value = info.logo_updated_at
    }
  }

  if (info.updated_at) {
    teamLogoTimestamp.value = info.updated_at
  }
}

onMounted(async () => {
  try {
    const teamInfo = await teamsApi.getMyTeam()
    if (teamInfo) {
      handleTeamInfoUpdate(teamInfo)
    }
  } catch (error) {
    console.error('Error loading team info:', error)
  }
})
</script>

<style scoped>
.my-team-container {
  min-height: calc(100vh - 316px);
  margin: 105px 20px 20px;
  display: flex;
    flex-direction: column;
  }

.team-page {
  background: var(--color-background);
  border-radius: 16px;
    display: flex;
    flex: 1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  }

.team-sidebar {
  width: 250px;
  background: linear-gradient(90deg, #00A3FF 0%, #5B51D8 100%);
  min-height: 100%;
  display: flex;
  flex-direction: column;
  }

.sidebar-menu {
  padding: 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.menu-item {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  border: 2px solid transparent;
  white-space: nowrap;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid white;
}

.menu-item.active {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
}

.content-area {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  background: white;
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  flex: 1;
}

.team-header-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  }

.menu-logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  background: white;
  }

.menu-logo-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  }

.team-name {
  font-weight: 500;
    flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  }

@media (max-width: 768px) {
  .team-page {
    flex-direction: column;
    min-height: 500px;
  }

  .team-sidebar {
    width: 100%;
    min-height: auto;
}

  .sidebar-menu {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10px;
    padding: 1rem;
  }

  .menu-item {
    flex: 1;
    min-width: 140px;
    text-align: center;
  }

  .content-area {
    padding: 1rem;
  }
}
</style>