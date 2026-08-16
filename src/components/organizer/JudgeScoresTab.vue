<template>
  <div class="jury-scores-tab">
    <!-- Десктопная версия фильтров -->
    <div class="filter-container desktop-filters">
      <el-radio-group v-model="selectedStageGroup" @change="handleStageGroupChange">
        <el-radio-button label="remote">Заочный этап</el-radio-button>
        <el-radio-button label="on_site">Очный этап</el-radio-button>
        <el-radio-button :label="null">Текущий этап</el-radio-button>
      </el-radio-group>
    </div>

    <!-- Мобильная версия фильтров -->
    <div class="filter-container mobile-filters">
      <el-select
        v-model="selectedStageGroup"
        placeholder="Выберите этап"
        @change="handleStageGroupChange"
        style="width: 100%"
      >
        <el-option label="Текущий этап" :value="null" />
        <el-option label="Заочный этап" value="remote" />
        <el-option label="Очный этап" value="on_site" />
      </el-select>
    </div>
    <!-- Десктопная таблица -->
    <div class="table-container desktop-view">
      <el-table
          v-loading="loading"
          :data="paginatedTeams"
          style="width: 100%"
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
            width="140"
            sortable
        >
          <template #default="{ row }">
            <div class="score-cell">
              <span class="score-value">{{ row.total_score.toFixed(1) }}</span>
              <span class="score-count">({{ row.evaluations_count }})</span>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column
            prop="average_score"
            label="Средний балл"
            width="120"
            sortable
        >
          <template #default="{ row }">
            <div class="score-cell">
              <span class="score-value">
                {{ row.evaluations_count > 0 ? (row.total_score / row.evaluations_count).toFixed(1) : '0.0' }}
              </span>
            </div>
          </template>
        </el-table-column>

        <el-table-column 
          v-if="judges.length > 0"
          label="Жюри" 
          min-width="200" 
          align="center"
          fixed="right"
        >
          <template #header>
            <div class="judge-column-header">
              <el-button
                :disabled="currentJudgeIndex === 0"
                :icon="ArrowLeft"
                circle
                size="small"
                @click="previousJudge"
              />
              <span class="judge-name">
                {{ currentJudge ? currentJudge.judge_name : 'Нет жюри' }}
                <span class="judge-counter" v-if="displayJudges.length > 1">
                  ({{ currentJudgeIndex + 1 }}/{{ displayJudges.length }})
                </span>
              </span>
              <el-button
                :disabled="currentJudgeIndex >= displayJudges.length - 1"
                :icon="ArrowRight"
                circle
                size="small"
                @click="nextJudge"
              />
            </div>
          </template>
          <template #default="{ row }">
            <div
                v-if="currentJudge"
                class="judge-evaluation"
                :class="{ 'no-score': !getJudgeEvaluation(row, currentJudge.judge_id).hasScore }"
            >
              <div class="judge-score-main">
                {{ getJudgeEvaluation(row, currentJudge.judge_id).text }}
              </div>
              <el-tooltip
                  v-if="getJudgeEvaluation(row, currentJudge.judge_id).hasScore"
                  effect="dark"
                  placement="top"
                  :show-after="300"
              >
                <template #content>
                  <div class="criteria-tooltip">
                    <div class="tooltip-header">
                      <strong>{{ currentJudge.judge_name }}</strong>
                      <div class="tooltip-email">{{ currentJudge.judge_email }}</div>
                    </div>
                    <el-divider style="margin: 8px 0;" />
                    <div v-for="n in 5" :key="n" class="criterion-row">
                      <span class="criterion-label">{{ getCriterionLabel(n) }}:</span>
                      <span class="criterion-score">
                        {{ getJudgeCriterion(row, currentJudge.judge_id, n) }}/10
                      </span>
                    </div>
                    <el-divider style="margin: 8px 0;" />
                    <div class="criterion-row total-row">
                      <span class="criterion-label"><strong>Итого:</strong></span>
                      <span class="criterion-score">
                        <strong>{{ getJudgeEvaluation(row, currentJudge.judge_id).text }}</strong>
                      </span>
                    </div>
                  </div>
                </template>
                <el-icon class="details-icon"><InfoFilled /></el-icon>
              </el-tooltip>
            </div>
            <div v-else class="no-judge">
              Нет жюри
            </div>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- Пагинация для десктопа -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[20, 50, 100, 200]"
          :total="sortedTeams.length"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>

    <!-- Мобильный вид - карточки -->
    <div class="mobile-view">
      <!-- Переключатель жюри для мобилки -->
      <div class="mobile-judge-selector" v-if="displayJudges.length > 0">
        <div class="judge-selector-header">
          <el-button
            :disabled="currentJudgeIndex === 0"
            :icon="ArrowLeft"
            circle
            size="small"
            @click="previousJudge"
          />
          <div class="judge-selector-info">
            <div class="judge-selector-name">
              {{ currentJudge ? currentJudge.judge_name : 'Нет жюри' }}
            </div>
            <div class="judge-selector-counter" v-if="displayJudges.length > 1">
              {{ currentJudgeIndex + 1 }} из {{ displayJudges.length }}
            </div>
          </div>
          <el-button
            :disabled="currentJudgeIndex >= displayJudges.length - 1"
            :icon="ArrowRight"
            circle
            size="small"
            @click="nextJudge"
          />
        </div>
      </div>

      <!-- Карточки команд -->
      <div class="teams-cards" v-loading="loading">
        <div
          v-for="team in paginatedTeams"
          :key="team.team_id"
          class="team-card"
        >
          <div class="team-card-header">
            <div class="team-card-title">
              <h3 class="team-card-name">{{ team.team_name }}</h3>
              <p class="team-card-motto">{{ team.team_motto }}</p>
            </div>
            <el-link
              v-if="team.solution_link"
              :href="team.solution_link"
              target="_blank"
              type="primary"
              class="team-card-solution"
            >
              <el-icon><Link /></el-icon>
              Решение
            </el-link>
          </div>

          <div class="team-card-scores">
            <div class="score-item">
              <span class="score-label">Сумма баллов:</span>
              <span class="score-value-large">
                {{ team.total_score.toFixed(1) }}
                <span class="score-count">({{ team.evaluations_count }})</span>
              </span>
            </div>
            <div class="score-item">
              <span class="score-label">Средний балл:</span>
              <span class="score-value-large">
                {{ team.evaluations_count > 0 ? (team.total_score / team.evaluations_count).toFixed(1) : '0.0' }}
              </span>
            </div>
          </div>

          <div class="team-card-judge" v-if="currentJudge">
            <div class="judge-evaluation-card">
              <div class="judge-evaluation-header">
                <span class="judge-label">Оценка жюри:</span>
                <span class="judge-name-small">{{ currentJudge.judge_name }}</span>
              </div>
              <div
                class="judge-score-card"
                :class="{ 'no-score': !getJudgeEvaluation(team, currentJudge.judge_id).hasScore }"
              >
                <div class="judge-score-value">
                  {{ getJudgeEvaluation(team, currentJudge.judge_id).text }}
                </div>
                <el-popover
                  v-if="getJudgeEvaluation(team, currentJudge.judge_id).hasScore"
                  placement="top"
                  :width="280"
                  trigger="click"
                >
                  <template #reference>
                    <el-button
                      :icon="InfoFilled"
                      circle
                      size="small"
                      type="primary"
                      text
                    />
                  </template>
                  <div class="criteria-popover">
                    <div class="popover-header">
                      <strong>{{ currentJudge.judge_name }}</strong>
                      <div class="popover-email">{{ currentJudge.judge_email }}</div>
                    </div>
                    <el-divider style="margin: 8px 0;" />
                    <div v-for="n in 5" :key="n" class="criterion-row">
                      <span class="criterion-label">{{ getCriterionLabel(n) }}:</span>
                      <span class="criterion-score">
                        {{ getJudgeCriterion(team, currentJudge.judge_id, n) }}/10
                      </span>
                    </div>
                    <el-divider style="margin: 8px 0;" />
                    <div class="criterion-row total-row">
                      <span class="criterion-label"><strong>Итого:</strong></span>
                      <span class="criterion-score">
                        <strong>{{ getJudgeEvaluation(team, currentJudge.judge_id).text }}</strong>
                      </span>
                    </div>
                  </div>
                </el-popover>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Пагинация для мобилки -->
      <div class="pagination-container mobile-pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[3, 5, 10]"
          :total="sortedTeams.length"
          layout="prev, pager, next"
          small
          @current-change="handlePageChange"
        />
        <div class="pagination-info">
          Показано {{ (currentPage - 1) * pageSize + 1 }}-{{ Math.min(currentPage * pageSize, sortedTeams.length) }} из {{ sortedTeams.length }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { evaluationsApi } from '@/api/evaluations'
import { eventsApi } from '@/api/events'
import { ElMessage } from 'element-plus'
import { InfoFilled, ArrowLeft, ArrowRight, Link } from '@element-plus/icons-vue'

const loading = ref(false)
const teams = ref([])
const judges = ref([])
const activeEvent = ref(null)
const tableHeight = 'calc(100vh - 300px)'
const selectedStageGroup = ref(null) // null = текущий этап, 'remote' = заочный, 'on_site' = очный
const currentJudgeIndex = ref(0) // Индекс текущего отображаемого жюри
const isMobile = ref(window.innerWidth <= 768)
const currentPage = ref(1)
const pageSize = ref(window.innerWidth <= 768 ? 3 : 10) // 3 для мобилки, 10 для десктопа

const sortedTeams = computed(() => {
  // Вычисляем average_score для каждой команды
  const teamsWithAverage = teams.value.map(team => {
    const avgScore = team.evaluations_count > 0 
      ? team.total_score / team.evaluations_count 
      : 0
    return { ...team, average_score: avgScore }
  })
  return [...teamsWithAverage].sort((a, b) => b.average_score - a.average_score)
})

const paginatedTeams = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return sortedTeams.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(sortedTeams.value.length / pageSize.value)
})

const handlePageChange = (page) => {
  currentPage.value = page
  // Прокручиваем вверх при смене страницы
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const currentJudge = computed(() => {
  if (displayJudges.value.length === 0 || currentJudgeIndex.value >= displayJudges.value.length) {
    return null
  }
  return displayJudges.value[currentJudgeIndex.value]
})

const isSameId = (left, right) => {
  if (left === null || left === undefined || right === null || right === undefined) {
    return false
  }
  return String(left) === String(right)
}

const hasActualScore = (evaluation) => {
  return Boolean(evaluation && evaluation.created_at && evaluation.total_score !== null && evaluation.total_score !== undefined)
}

const displayJudges = computed(() => {
  const scoredIds = new Set()
  teams.value.forEach(team => {
    (team.evaluations || []).forEach(evaluation => {
      if (hasActualScore(evaluation)) {
        scoredIds.add(String(evaluation.judge_id))
      }
    })
  })

  return [...judges.value].sort((left, right) => {
    const leftScored = scoredIds.has(String(left.judge_id)) ? 0 : 1
    const rightScored = scoredIds.has(String(right.judge_id)) ? 0 : 1
    if (leftScored !== rightScored) {
      return leftScored - rightScored
    }
    return String(left.judge_name || '').localeCompare(String(right.judge_name || ''), 'ru')
  })
})

const findTeamEvaluation = (team, judgeId) => {
  return (team?.evaluations || []).find(evaluation => isSameId(evaluation.judge_id, judgeId))
}

const getJudgeEvaluation = (team, judgeId) => {
  const evaluation = findTeamEvaluation(team, judgeId)
  if (!hasActualScore(evaluation)) {
    return { text: 'Нет оценки', hasScore: false }
  }
  return { text: `${evaluation.total_score}/50`, hasScore: true }
}

const getJudgeCriterion = (team, judgeId, criterionNumber) => {
  const evaluation = findTeamEvaluation(team, judgeId)
  if (!hasActualScore(evaluation)) {
    return '-'
  }
  return evaluation[`criterion_${criterionNumber}`]
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

const loadActiveEvent = async () => {
  try {
    activeEvent.value = await eventsApi.getActiveEvent()
  } catch (error) {
    console.error('Error loading active event:', error)
    ElMessage.error('Ошибка при загрузке активного события')
  }
}

const loadJudges = async () => {
  if (!activeEvent.value) {
    console.warn('Active event not loaded, cannot load judges')
    return
  }
  
  try {
    const response = await eventsApi.getEventJudges(activeEvent.value.id)
    judges.value = response.judges.map(judge => ({
      judge_id: judge.id,
      judge_name: judge.full_name,
      judge_email: judge.email
    }))
    // Сбрасываем индекс на первый жюри
    currentJudgeIndex.value = 0
    console.log('Loaded judges:', judges.value.length)
  } catch (error) {
    console.error('Error loading judges:', error)
    ElMessage.error('Ошибка при загрузке жюри')
    // Если жюри не загружены, используем жюри из оценок как fallback
    if (teams.value.length > 0 && teams.value[0].evaluations) {
      const judgesFromEvaluations = new Map()
      teams.value.forEach(team => {
        team.evaluations.forEach(evaluation => {
          if (!judgesFromEvaluations.has(evaluation.judge_id)) {
            judgesFromEvaluations.set(evaluation.judge_id, {
              judge_id: evaluation.judge_id,
              judge_name: evaluation.judge_name,
              judge_email: evaluation.judge_email
            })
          }
        })
      })
      judges.value = Array.from(judgesFromEvaluations.values())
      currentJudgeIndex.value = 0
      console.log('Using judges from evaluations:', judges.value.length)
    }
  }
}

const nextJudge = () => {
  if (currentJudgeIndex.value < displayJudges.value.length - 1) {
    currentJudgeIndex.value++
  }
}

const previousJudge = () => {
  if (currentJudgeIndex.value > 0) {
    currentJudgeIndex.value--
  }
}

const loadEvaluations = async () => {
  try {
    loading.value = true
    const params = selectedStageGroup.value ? { stage_group: selectedStageGroup.value } : {}
    teams.value = await evaluationsApi.getDetailedEvaluations(params)
  } catch (error) {
    console.error('Error loading evaluations:', error)
    ElMessage.error('Ошибка при загрузке оценок')
  } finally {
    loading.value = false
  }
}

const handleStageGroupChange = () => {
  loadEvaluations()
}

const handleResize = () => {
  const wasMobile = isMobile.value
  isMobile.value = window.innerWidth <= 768
  
  // При переключении между мобильной и десктопной версией меняем размер страницы
  if (wasMobile !== isMobile.value) {
    if (isMobile.value) {
      pageSize.value = 3
    } else {
      pageSize.value = 10
    }
    currentPage.value = 1 // Сбрасываем на первую страницу
  }
}

onMounted(async () => {
  window.addEventListener('resize', handleResize)
  await loadActiveEvent()
  await loadEvaluations()
  // Загружаем жюри после оценок, чтобы можно было использовать fallback
  await loadJudges()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.jury-scores-tab {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.filter-container {
  margin-bottom: 16px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
}

.desktop-filters {
  display: block;
}

.mobile-filters {
  display: none;
}

.judge-column-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.judge-name {
  font-weight: 500;
  min-width: 150px;
  text-align: center;
}

.judge-counter {
  font-size: 12px;
  color: #909399;
  font-weight: normal;
  margin-left: 4px;
}

.no-judge {
  color: #909399;
  font-style: italic;
}

.table-container {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.desktop-view {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.desktop-view :deep(.el-table) {
  flex: 1;
  min-height: 0;
  overflow: auto;
}

.desktop-view :deep(.el-table__body-wrapper) {
  max-height: calc(100vh - 400px);
  overflow-y: auto;
}

.pagination-container {
  margin-top: 16px;
  padding: 16px 0;
  background: white;
  border-top: 1px solid #e4e7ed;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  position: relative;
  z-index: 10;
}

.mobile-pagination {
  flex-direction: column;
  gap: 12px;
}

.pagination-info {
  font-size: 12px;
  color: #606266;
  text-align: center;
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
  padding: 8px;
  min-height: 40px;
}

.judge-evaluation.no-score {
  color: #909399;
  font-weight: normal;
}

.judge-score-main {
  font-size: 14px;
  font-weight: 600;
}

.details-icon {
  font-size: 16px;
  color: #409EFF;
  cursor: pointer;
}

.criteria-tooltip {
  padding: 8px;
  min-width: 250px;
}

.tooltip-header {
  margin-bottom: 8px;
}

.tooltip-header strong {
  display: block;
  color: white;
  font-size: 14px;
  margin-bottom: 4px;
}

.tooltip-email {
  color: #909399;
  font-size: 12px;
}

.total-row {
  margin-top: 4px;
  padding-top: 4px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
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

/* Мобильный вид */
.mobile-view {
  display: none;
}

.mobile-judge-selector {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.judge-selector-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.judge-selector-info {
  flex: 1;
  text-align: center;
}

.judge-selector-name {
  font-weight: 500;
  font-size: 16px;
  color: #303133;
  margin-bottom: 4px;
}

.judge-selector-counter {
  font-size: 12px;
  color: #909399;
}

.teams-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.team-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e4e7ed;
}

.team-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e4e7ed;
}

.team-card-title {
  flex: 1;
}

.team-card-name {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.team-card-motto {
  margin: 0;
  font-size: 14px;
  color: #606266;
}

.team-card-solution {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
}

.team-card-scores {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e4e7ed;
}

.score-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.score-label {
  font-size: 12px;
  color: #909399;
}

.score-value-large {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.score-value-large .score-count {
  font-size: 14px;
  font-weight: normal;
  color: #909399;
  margin-left: 4px;
}

.team-card-judge {
  margin-top: 8px;
}

.judge-evaluation-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
}

.judge-evaluation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.judge-label {
  font-size: 12px;
  color: #909399;
}

.judge-name-small {
  font-size: 12px;
  font-weight: 500;
  color: #606266;
}

.judge-score-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
}

.judge-score-card.no-score {
  opacity: 0.6;
}

.judge-score-value {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.judge-score-card.no-score .judge-score-value {
  color: #909399;
  font-weight: normal;
}

.criteria-popover {
  padding: 4px;
}

.popover-header {
  margin-bottom: 8px;
}

.popover-header strong {
  display: block;
  font-size: 14px;
  margin-bottom: 4px;
}

.popover-email {
  font-size: 12px;
  color: #909399;
}

@media (max-width: 768px) {
  .desktop-view {
    display: none !important;
  }

  .desktop-filters {
    display: none !important;
  }

  .mobile-filters {
    display: block !important;
  }

  .mobile-view {
    display: block;
  }

  .jury-scores-tab {
    height: auto;
    padding-bottom: 20px;
  }

  .filter-container {
    padding: 12px;
  }

  .mobile-filters :deep(.el-select) {
    width: 100%;
  }

  .mobile-filters :deep(.el-input__inner) {
    font-size: 14px;
    padding: 10px 12px;
  }
}

@media (min-width: 769px) {
  .mobile-view {
    display: none !important;
  }

  .desktop-view {
    display: flex !important;
  }
}
</style>