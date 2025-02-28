<template>
  <div class="teams-tab">
    <div class="table-container">
      <el-table
          v-loading="loading"
          :data="sortedTeams"
          style="width: 100%"
          :height="tableHeight"
          @row-click="openEvaluationDialog"
      >
        <el-table-column prop="team_name" label="Название команды" min-width="200">
          <template #default="{ row }">
            <div class="team-name">
              <el-image
                  v-if="row.logo_url"
                  :src="row.logo_url"
                  class="team-logo"
                  fit="cover"
              />
              {{ row.team_name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="total_score" label="Общая оценка" width="150" sortable>
          <template #default="{ row }">
            <div class="score-cell">
              <span class="score-value">{{ row.total_score }}</span>
              <span class="score-max">/50</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Критерии" min-width="400">
          <template #default="{ row }">
            <div class="criteria-list">
              <el-tooltip
                  v-for="n in 5"
                  :key="n"
                  :content="getCriterionLabel(n)"
                  placement="top"
              >
                <div class="criterion-item">
                  <div class="criterion-score">
                    {{ row[`criterion_${n}`] }}<span class="criterion-max">/10</span>
                  </div>
                  <div class="criterion-label">{{ getCriterionShortLabel(n) }}</div>
                </div>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <EvaluationDialog
        v-if="selectedTeam"
        v-model:visible="dialogVisible"
        :team="selectedTeam"
        :initial-evaluation="selectedTeam"
        :is-edit="true"
        @evaluation-submitted="handleEvaluationSubmitted"
    />
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import EvaluationDialog from './EvaluationDialog.vue'
import {ElMessage} from 'element-plus'
import {evaluationsApi} from '@/api/evaluations'

const loading = ref(false)
const teams = ref([])
const dialogVisible = ref(false)
const selectedTeam = ref(null)
const tableHeight = 'calc(100vh - 250px)'

const sortedTeams = computed(() => {
  return [...teams.value].sort((a, b) => b.total_score - a.total_score)
})

const getCriterionLabel = (n) => {
  const labels = {
    1: 'Соответствие результата поставленной задаче',
    2: 'Корректность, оригинальность и инновационность',
    3: 'Проработанность технического решения',
    4: 'Эффективность предложенного решения',
    5: 'Качество выступления'
  }
  return labels[n]
}

const getCriterionShortLabel = (n) => {
  const labels = {
    1: 'Соответствие',
    2: 'Оригинальность',
    3: 'Проработка',
    4: 'Эффективность',
    5: 'Выступление'
  }
  return labels[n]
}

const loadTeams = async () => {
  try {
    loading.value = true
    const evaluations = await evaluationsApi.getMyEvaluations()
    teams.value = evaluations
  } catch (error) {
    console.error('Error loading evaluations:', error)
    ElMessage({
      message: 'Ошибка при загрузке оценок',
      type: 'error'
    })
  } finally {
    loading.value = false
  }
}

const openEvaluationDialog = (team) => {
  selectedTeam.value = team
  dialogVisible.value = true
}

const handleEvaluationSubmitted = async () => {
  dialogVisible.value = false
  await loadTeams()
}

onMounted(() => {
  loadTeams()
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

.team-name {
  display: flex;
  align-items: center;
  gap: 12px;
}

.team-logo {
  width: 32px;
  height: 32px;
  border-radius: 4px;
}

.score-cell {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.score-value {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.score-max {
  font-size: 14px;
  color: #909399;
}

.criteria-list {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.criterion-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.criterion-score {
  font-weight: 600;
  color: #333;
}

.criterion-max {
  font-size: 12px;
  color: #909399;
}

.criterion-label {
  font-size: 12px;
  color: #606266;
}

:deep(.el-table__row) {
  cursor: pointer;
  transition: background-color 0.3s ease;
}

:deep(.el-table__row:hover) {
  background-color: #f5f7fa;
}
</style>