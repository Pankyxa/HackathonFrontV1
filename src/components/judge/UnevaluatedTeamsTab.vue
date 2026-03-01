<template>
  <div class="teams-tab">
    <!-- Десктопная таблица -->
    <div class="table-container desktop-view">
      <el-table
          v-loading="loading"
          :data="teams"
          style="width: 100%"
          :height="tableHeight"
          @row-click="openEvaluationPage"
      >
        <el-table-column prop="team_name" label="Название команды" min-width="200"/>
        <el-table-column prop="team_motto" label="Девиз" min-width="200"/>
      </el-table>
    </div>

    <!-- Мобильный вид - карточки -->
    <div class="mobile-view">
      <div class="teams-cards" v-loading="loading">
        <div
          v-for="team in paginatedTeams"
          :key="team.team_id"
          class="team-card"
          @click="openEvaluationPage(team)"
        >
          <div class="team-card-content">
            <h3 class="team-card-name">{{ team.team_name }}</h3>
            <p class="team-card-motto">{{ team.team_motto }}</p>
          </div>
        </div>
      </div>

      <!-- Пагинация для мобилки -->
      <div class="pagination-container mobile-pagination">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="teams.length"
          layout="prev, pager, next"
          size="small"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { evaluationsApi } from '@/api/evaluations'

const emit = defineEmits(['evaluation-updated'])
const router = useRouter()

const loading = ref(false)
const teams = ref([])
const tableHeight = 'calc(100vh - 250px)'

// Пагинация для мобилки
const currentPage = ref(1)
const pageSize = ref(4) // По 4 команды на мобилке

const paginatedTeams = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return teams.value.slice(start, end)
})

const handlePageChange = (page) => {
  currentPage.value = page
  // Прокрутка вверх при смене страницы
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const loadTeams = async () => {
  try {
    loading.value = true
    // Всегда используем текущий этап (null)
    teams.value = await evaluationsApi.getUnevaluatedTeams(null)
    // Сбрасываем страницу при загрузке новых данных
    currentPage.value = 1
  } catch (error) {
    console.error('Error loading teams:', error)
    ElMessage.error('Ошибка при загрузке списка команд')
  } finally {
    loading.value = false
  }
}

const openEvaluationPage = (team) => {
  router.push(`/judge/teams/${team.team_id}/evaluate`)
}

onMounted(() => {
  loadTeams()
})

defineExpose({
  loadTeams
})
</script>

<style scoped>
.teams-tab {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.table-container {
  flex: 1;
  overflow: hidden;
}

:deep(.el-table__row) {
  cursor: pointer;
  transition: background-color 0.3s ease;
}

:deep(.el-table__row:hover) {
  background-color: #f5f7fa;
}

/* Мобильная версия - скрыта на десктопе */
.mobile-view {
  display: none;
}

.teams-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0;
  padding-bottom: 20px;
}

.team-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e4e7ed;
}

.team-card:active {
  transform: scale(0.98);
}

.team-card-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.team-card-name {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  line-height: 1.4;
}

.team-card-motto {
  margin: 0;
  font-size: 15px;
  color: #606266;
  line-height: 1.5;
  font-style: italic;
}

.mobile-pagination {
  padding: 16px;
  background: white;
  display: flex;
  justify-content: center;
  border-top: 1px solid #e4e7ed;
  margin-top: 16px;
}

/* Адаптация для мобильных устройств */
@media (max-width: 768px) {
  .desktop-view {
    display: none;
  }

  .mobile-view {
    display: block;
    width: 100%;
  }

  .teams-tab {
    padding-bottom: 0;
    width: 100%;
  }

  .team-card {
    margin: 0;
    border-radius: 0;
    border-left: none;
    border-right: none;
    border-top: 1px solid #e4e7ed;
    border-bottom: 1px solid #e4e7ed;
    box-shadow: none;
  }

  .team-card:first-child {
    border-top: none;
  }

  .team-card-name {
    font-size: 18px;
  }

  .team-card-motto {
    font-size: 14px;
  }
}
</style>