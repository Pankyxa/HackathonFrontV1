<template>
  <TheHeader></TheHeader>
  <div class="my-team-container">
    <div class="team-page">
      <div class="team-sidebar">
        <div class="sidebar-menu">
          <div class="menu-item"
               v-for="item in menuItems"
               :key="item.id"
               :class="{ active: activeTab === item.id }"
               @click="activeTab = item.id">
            {{ item.title }}
          </div>
        </div>
      </div>
      <div class="content-area">
        <div class="content-wrapper">
          <component :is="currentComponent"></component>
        </div>
      </div>
    </div>
  </div>
  <TheFooter></TheFooter>
</template>

<script setup>
import {ref, computed} from 'vue'
import TheHeader from "@/components/TheHeader.vue";
import TheFooter from "@/components/TheFooter.vue";
import TeamInfo from '@/components/team/TeamInfo.vue'

const activeTab = ref('info')

const menuItems = [
  {id: 'info', title: 'Название'},
  {id: 'team', title: 'Состав'},
  {id: 'task', title: 'Задача'},
  {id: 'examples', title: 'Примеры сайтов'}
]

const currentComponent = computed(() => {
  switch (activeTab.value) {
    case 'info':
      return TeamInfo
    default:
      return null
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
  min-height: 100%; /* Занимает всю высоту родителя */
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

@media (max-width: 768px) {
  .my-team-container {
    min-height: 80%;
    margin: 90px 10px 10px 10px;
  }

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