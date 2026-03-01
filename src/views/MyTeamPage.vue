<template>
  <TheHeader></TheHeader>
  <div class="my-team-container">
    <div class="team-page">
      <div class="team-sidebar">
        <div class="sidebar-menu">
          <div
              class="menu-item team-header-item"
              :class="{ active: activeTab === 'info' }"
              @click="handleTabChange('info')"
          >
            <img
                v-if="teamLogo"
                :src="teamLogoUrl"
                alt="Team Logo"
                class="menu-logo"
            />
            <div v-else class="menu-logo-placeholder"></div>
            <span class="team-name">{{ teamName || getDefaultTitle }}</span>
          </div>
          <div
              v-for="item in menuItems"
              :key="item.id"
              class="menu-item"
              :class="{ active: activeTab === item.id }"
              @click="handleTabChange(item.id)"
          >
            {{ item.title }}
          </div>
        </div>
      </div>
      <div class="content-area" ref="contentAreaRef">
        <div class="content-wrapper">
          <component
              :is="currentComponent"
              :view-mode="viewMode"
              :team-id="teamId"
              @update:teamInfo="handleTeamInfoUpdate"
          ></component>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, watch, nextTick} from 'vue'
import {useRoute} from 'vue-router'
import TheHeader from "@/components/TheHeader.vue"
import TeamInfo from '@/components/team/TeamInfo.vue'
import {teamsApi} from '@/api/teams'
import InitialData from '@/components/team/InitialData.vue'
import TestData from '@/components/team/TestData.vue'

import {useStageStore} from "@/stores/stage.js";
import {useLoadingStore} from "@/stores/loading.js";
import TeamSolution from "@/components/team/TeamSolution.vue";
import TeamTask from "@/components/team/TeamTask.vue";

const stageStore = useStageStore();
const loadingStore = useLoadingStore();

const route = useRoute()
const activeTab = ref('info')
const teamName = ref('')
const teamLogo = ref(null)
const teamId = ref(route.params.id || null)
const teamLogoTimestamp = ref(Date.now())
const teamInfo = ref({})
const contentAreaRef = ref(null)

const viewMode = computed(() => {
  return route.path.includes('/mentor/teams/') ? 'mentor' : 'default'
})

const getDefaultTitle = computed(() => {
  return viewMode.value === 'mentor' ? 'Команда' : 'Моя команда'
})

const teamStatus = computed(() => {
  return teamInfo.value?.status_details?.status
})

const menuItems = computed(() => {
  const baseItems = [
    {id: 'task', title: 'Задача'},
  ];

  const currentOrder = stageStore.currentStage?.order || 0;
  const taskDistributionOrder = 3;

  const items = [...baseItems];

  // Таб "Исходные данные" скрыт, но компонент оставлен для совместимости
  // if (currentOrder >= registrationClosedOrder && teamStatus.value === 'active') {
  //   items.push(
  //       {id: 'initial-data', title: 'Исходные данные'}
  //   )
  // }

  if (currentOrder >= taskDistributionOrder && teamStatus.value === 'active') {
    items.push(
      {id: 'test-data', title: 'Тестовые данные'},
      {id: 'attach solution', title: 'Решение'}
    )
  }

  return items;
});

const teamLogoUrl = computed(() => {
  if (!teamLogo.value) return null;
  return `${teamLogo.value}?t=${teamLogoTimestamp.value}`;
})

const currentComponent = computed(() => {
  switch (activeTab.value) {
    case 'info':
      return TeamInfo
    case 'task':
      return TeamTask
    case 'initial-data':
      return InitialData
    case 'test-data':
      return TestData
    case 'attach solution':
      return TeamSolution
    default:
      return null
  }
})

const handleTeamInfoUpdate = (info) => {
  loadingStore.isLoading = true
  teamName.value = info.team_name
  teamInfo.value = info
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
  loadingStore.isLoading = false
}


// Обработчик переключения табов с сбросом скролла
const handleTabChange = (tabId) => {
  // Меняем таб
  activeTab.value = tabId
  
  // Функция для сброса скролла
  const resetScroll = () => {
    // Пробуем через ref
    if (contentAreaRef.value) {
      contentAreaRef.value.scrollTop = 0
      contentAreaRef.value.scrollTo({ top: 0, behavior: 'instant' })
    }
    
    // Fallback: пробуем найти элемент через querySelector
    const contentArea = document.querySelector('.content-area')
    if (contentArea) {
      contentArea.scrollTop = 0
      contentArea.scrollTo({ top: 0, behavior: 'instant' })
    }
    
    // Также сбрасываем глобальный скролл на всякий случай
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
  
  // Сбрасываем сразу
  resetScroll()
  
  // Сбрасываем после обновления DOM
  nextTick(() => {
    resetScroll()
  })
  
  // Еще одна попытка после задержки
  setTimeout(() => {
    resetScroll()
  }, 100)
  
  // Финальная попытка после более длительной задержки
  setTimeout(() => {
    resetScroll()
  }, 300)
}

onMounted(async () => {
  try {
    // Обновляем информацию об этапе при загрузке страницы
    // Это важно, если этап изменился во время принятия приглашения
    try {
      await stageStore.updateStageInfo()
    } catch (stageError) {
      console.warn('Не удалось обновить информацию об этапе:', stageError)
      // Продолжаем загрузку даже если обновление этапа не удалось
    }

    const teamInfo = await teamsApi.getTeam(teamId.value);
    if (teamInfo) {
      handleTeamInfoUpdate(teamInfo);
    }
  } catch (error) {
    console.error('Error loading team info:', error);
  }
})
</script>

<style scoped>
.my-team-container {
  min-height: 100vh; /* min-h-screen - позволяет контенту расширяться */
  width: 100%; /* w-full */
  margin: 64px 0 0 0; /* Отступ для фиксированного хедера */
  padding: 0;
  display: flex; /* flex */
  background-color: #f8fafc; /* bg-slate-50 */
}

.team-page {
  display: flex;
  flex: 1;
  width: 100%;
  min-height: calc(100vh - 64px); /* Минимальная высота для заполнения экрана */
  background: transparent;
  border-radius: 0;
  box-shadow: none;
  max-width: none;
}

.team-sidebar {
  width: 250px; /* Фиксированная ширина */
  background: white; /* bg-white */
  border-right: 1px solid #e2e8f0; /* border-r border-slate-200 */
  height: calc(100vh - 64px); /* Высота минус хедер */
  position: fixed; /* Фиксированный сайдбар */
  top: 64px; /* Отступ от хедера */
  left: 0; /* Прижат к левому краю */
  display: flex;
  flex-direction: column;
  flex-shrink: 0; /* Не сжимается */
  overflow-y: auto; /* Скролл если меню длинное */
  z-index: 10; /* Поверх контента */
}

.sidebar-menu {
  padding: 16px 0; /* Убираем горизонтальный padding, оставляем только вертикальный */
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 4px; /* Уменьшаем gap между элементами */
  overflow-y: auto; /* Скролл если меню длинное */
}

.menu-item {
  padding: 14px 20px; /* Увеличиваем вертикальный padding для touch targets */
  border-radius: 0; /* Убираем скругления */
  cursor: pointer;
  transition: all 0.2s ease;
  color: #475569; /* text-slate-600 - неактивное состояние */
  background: transparent;
  border: none;
  border-left: 4px solid transparent; /* Место для акцентной линии */
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
  font-size: 15px;
  position: relative;
  margin: 0 8px; /* Небольшой горизонтальный отступ */
}

.menu-item:hover {
  background: #f1f5f9; /* hover:bg-slate-50 */
}

.menu-item.active {
  background: #eff6ff; /* bg-blue-50 */
  color: #2563eb; /* text-blue-600 */
  font-weight: 600;
  border-left: 4px solid #2563eb; /* border-l-4 border-blue-600 */
}

.content-area {
  flex: 1; /* flex-1 */
  margin-left: 250px; /* Отступ для фиксированного сайдбара */
  min-height: calc(100vh - 64px); /* Минимальная высота для заполнения экрана */
  overflow-y: auto; /* overflow-y-auto - скролл внутри этой области */
  padding: 32px; /* p-8 */
  background: #f8fafc; /* bg-slate-50 - фон страницы, не белая карточка */
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  flex: 1;
}

.team-header-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 14px 20px;
  color: #1e293b; /* text-slate-800 */
  font-weight: 600;
  border-bottom: 1px solid #e2e8f0; /* border-slate-200 */
  margin: 0 8px 8px 8px; /* Горизонтальный отступ */
  border-left: 4px solid transparent; /* Место для акцентной линии */
}

.team-header-item.active {
  background: transparent; /* Заголовок не должен иметь активный фон */
  color: #1e293b; /* text-slate-800 */
  border-left: 4px solid transparent; /* Убираем акцентную линию для заголовка */
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
  background: #e2e8f0; /* bg-slate-200 */
}

.team-name {
  font-weight: 500;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 768px) {
  .my-team-container {
    flex-direction: column;
    height: auto;
    min-height: calc(100vh - 64px);
    overflow: visible;
    margin-top: 64px; /* Отступ для хедера */
  }

  .team-page {
    flex-direction: column;
    width: 100%;
    min-height: auto;
    overflow: visible;
  }

  .team-sidebar {
    width: 100%;
    position: relative;
    height: auto;
    top: 0;
    left: 0;
    border-right: none;
    border-bottom: 1px solid #e2e8f0; /* border-slate-200 */
    overflow: visible;
    z-index: 1;
  }

  .sidebar-menu {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
    padding: 12px 16px;
    overflow: visible;
  }

  .menu-item {
    flex: 1;
    min-width: 120px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 12px 16px;
    border-left: none; /* Убираем акцентную линию на мобильных */
    border-bottom: 2px solid transparent;
    font-size: 14px;
  }
  
  .menu-item.active {
    border-left: none;
    border-bottom: 2px solid #2563eb; /* Акцентная линия снизу на мобильных */
  }
  
  .team-header-item {
    width: 100%;
    border-bottom: 1px solid #e2e8f0; /* Оставляем границу на мобильных */
    margin: 0 0 8px 0;
    border-left: none;
    padding: 12px 16px;
    font-size: 16px;
  }

  .menu-logo,
  .menu-logo-placeholder {
    width: 32px;
    height: 32px;
  }

  .content-area {
    margin-left: 0; /* Убираем отступ для сайдбара на мобилке */
    padding: 16px; /* Компактный padding */
    min-height: auto;
    width: 100%;
    overflow: visible;
  }

  .content-wrapper {
    width: 100%;
    max-width: 100%;
    margin: 0;
  }
}
</style>