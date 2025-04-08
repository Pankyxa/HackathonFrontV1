<template>
  <div class="jury-scores-tab">
    <div class="table-container">
      <el-table
          v-loading="loading"
          :data="sortedTeams"
          style="width: 100%"
          :height="tableHeight"
          border
      >
        <el-table-column
            prop="team_name"
            label="Команда"
            fixed
            min-width="200"
        >
          <template #default="{ row }">
            <div class="team-info">
              <div class="team-name">{{ row.team_name }}</div>
              <div class="team-motto">{{ row.team_motto }}</div>
              <el-link
                  v-if="row.solution_link"
                  :href="row.solution_link"
                  target="_blank"
                  type="primary"
                  class="solution-link"
              >
                Решение
              </el-link>
            </div>
          </template>
        </el-table-column>

        <el-table-column
            prop="total_score"
            label="Сумма баллов"
            width="120"
            sortable
        >
          <template #default="{ row }">
            <div class="score-cell">
              <span class="score-value">{{ row.total_score.toFixed(1) }}</span>
              <span class="score-count">({{ row.evaluations_count }})</span>
            </div>
          </template>
        </el-table-column>

        <template v-for="judge in judges" :key="judge.judge_id">
          <el-table-column :label="judge.judge_name" min-width="200">
            <template #default="{ row }">
              <div
                  class="judge-evaluation"
                  :class="{ 'no-score': !getJudgeEvaluation(row, judge.judge_id).hasScore }"
              >
                {{ getJudgeEvaluation(row, judge.judge_id).text }}
                <el-tooltip
                    v-if="getJudgeEvaluation(row, judge.judge_id).hasScore"
                    effect="dark"
                    placement="top"
                >
                  <template #content>
                    <div class="criteria-tooltip">
                      <div v-for="n in 5" :key="n" class="criterion-row">
                        <span class="criterion-label">{{ getCriterionLabel(n) }}:</span>
                        <span class="criterion-score">
                          {{ getJudgeCriterion(row, judge.judge_id, n) }}/10
                        </span>
                      </div>
                    </div>
                  </template>
                  <el-icon class="details-icon"><InfoFilled /></el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { evaluationsApi } from '@/api/evaluations'
import { ElMessage } from 'element-plus'
import { InfoFilled } from '@element-plus/icons-vue'

const loading = ref(false)
const teams = ref([])
const tableHeight = 'calc(100vh - 250px)'

const judges = computed(() => {
  if (!teams.value.length) return []

  const judgesMap = new Map()
  teams.value.forEach(team => {
    team.evaluations.forEach(evaluation => {
      if (!judgesMap.has(evaluation.judge_id)) {
        judgesMap.set(evaluation.judge_id, {
          judge_id: evaluation.judge_id,
          judge_name: evaluation.judge_name,
          judge_email: evaluation.judge_email
        })
      }
    })
  })
  return Array.from(judgesMap.values())
})

const sortedTeams = computed(() => {
  return [...teams.value].sort((a, b) => b.average_score - a.average_score)
})

const getJudgeEvaluation = (team, judgeId) => {
  const evaluation = team.evaluations.find(e => e.judge_id === judgeId)
  if (!evaluation || evaluation.total_score === null) {
    return { text: 'Нет оценки', hasScore: false }
  }
  return { text: `${evaluation.total_score}/50`, hasScore: true }
}

const getJudgeCriterion = (team, judgeId, criterionNumber) => {
  const evaluation = team.evaluations.find(e => e.judge_id === judgeId)
  return evaluation ? evaluation[`criterion_${criterionNumber}`] : '-'
}

const getCriterionLabel = (n) => {
  const labels = {
    1: 'Соответствие результата',
    2: 'Оригинальность',
    3: 'Проработанность',
    4: 'Эффективность',
    5: 'Качество выступления'
  }
  return labels[n]
}

const loadEvaluations = async () => {
  try {
    loading.value = true
    teams.value = await evaluationsApi.getDetailedEvaluations()
  } catch (error) {
    console.error('Error loading evaluations:', error)
    ElMessage.error('Ошибка при загрузке оценок')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadEvaluations()
})
</script>

<style scoped>
.jury-scores-tab {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.table-container {
  flex: 1;
  overflow: hidden;
}

.team-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.team-name {
  font-weight: 500;
  color: #333;
}

.team-motto {
  font-size: 0.9em;
  color: #666;
}

.solution-link {
  font-size: 0.9em;
  margin-top: 4px;
}

.score-cell {
  display: flex;
  align-items: center;
  gap: 4px;
}

.score-value {
  font-weight: 500;
  color: #333;
}

.score-count {
  font-size: 0.9em;
  color: #909399;
}

.judge-evaluation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 500;
}

.judge-evaluation.no-score {
  color: #909399;
  font-weight: normal;
}

.details-icon {
  font-size: 16px;
  color: #409EFF;
  cursor: pointer;
}

.criteria-tooltip {
  padding: 4px;
}

.criterion-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 4px;
}

.criterion-row:last-child {
  margin-bottom: 0;
}

.criterion-label {
  color: #909399;
}

.criterion-score {
  font-weight: 500;
  color: white;
}

:deep(.el-table__row) {
  transition: background-color 0.3s ease;
}

:deep(.el-table__row:hover) {
  background-color: #f5f7fa;
}

:deep(.el-table .cell) {
  padding: 8px;
}

@media (max-width: 768px) {
  .jury-scores-tab {
    height: auto;
  }

  :deep(.el-table) {
    width: 100%;
    overflow-x: auto;
  }
}
</style>