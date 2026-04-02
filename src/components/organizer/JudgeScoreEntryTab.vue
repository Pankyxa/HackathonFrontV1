<template>
  <div class="judge-score-entry-tab" v-loading="loading">
    <div class="selection-card">
      <div class="selection-header">
        <div>
          <h2 class="section-title">Ввод оценок жюри</h2>
          <p class="section-description">
            Выберите жюри и команду, чтобы создать новую оценку или обновить уже сохраненную.
          </p>
        </div>

        <el-button
          type="default"
          @click="refreshData({ preserveSelection: true, showMessage: true })"
        >
          Обновить данные
        </el-button>
      </div>

      <div class="selection-grid">
        <div class="field-group">
          <span class="field-label">Жюри</span>
          <el-select
            v-model="selectedJudgeId"
            filterable
            clearable
            placeholder="Выберите жюри"
            :disabled="!judges.length"
          >
            <el-option
              v-for="judge in judges"
              :key="judge.judge_id"
              :label="judge.judge_name"
              :value="judge.judge_id"
            >
              <div class="option-content">
                <span>{{ judge.judge_name }}</span>
                <span class="option-secondary">{{ judge.judge_email }}</span>
              </div>
            </el-option>
          </el-select>
        </div>

        <div class="field-group">
          <span class="field-label">Команда</span>
          <el-select
            v-model="selectedTeamId"
            filterable
            clearable
            placeholder="Выберите команду"
            :disabled="!teams.length"
          >
            <el-option
              v-for="team in teams"
              :key="team.team_id"
              :label="team.team_name"
              :value="team.team_id"
            >
              <span>{{ team.team_name }}</span>
            </el-option>
          </el-select>
        </div>
      </div>

      <el-alert
        v-if="loadWarning"
        :title="loadWarning"
        type="warning"
        :closable="false"
        show-icon
        class="status-alert"
      />

      <el-alert
        v-else-if="!activeEvent"
        title="Активное событие не найдено. Выбор жюри недоступен, пока не будет активировано событие."
        type="warning"
        :closable="false"
        show-icon
        class="status-alert"
      />

      <el-alert
        v-else-if="activeEvent && !judges.length"
        title="В активном событии пока нет жюри. Добавьте жюри к событию, чтобы выставлять оценки."
        type="info"
        :closable="false"
        show-icon
        class="status-alert"
      />

      <el-alert
        v-else-if="!isEvaluationStage"
        title="Ввод оценок доступен только на этапах оценки решений и защиты. Дождитесь нужного этапа, чтобы редактировать оценки."
        type="warning"
        :closable="false"
        show-icon
        class="status-alert"
      />
    </div>

    <div v-if="selectedTeam && selectedJudge && isEvaluationStage" class="team-context-card">
      <div class="team-context-main">
        <div class="team-context-info">
          <span class="context-label">Команда</span>
          <h3 class="team-name">{{ selectedTeam.team_name }}</h3>
          <p v-if="selectedTeam.team_motto" class="team-motto">{{ selectedTeam.team_motto }}</p>
          <el-link
            v-if="selectedTeam.solution_link"
            type="primary"
            :href="selectedTeam.solution_link"
            target="_blank"
            class="solution-link"
          >
            <el-icon><Link /></el-icon>
            Решение на GitHub
          </el-link>
        </div>

        <div class="team-context-side">
          <div class="judge-summary">
            <span class="context-label">Жюри</span>
            <strong class="judge-name">{{ selectedJudge.judge_name }}</strong>
            <span class="judge-email">{{ selectedJudge.judge_email }}</span>
          </div>

          <el-tag :type="evaluationStatusType" effect="light" size="large">
            {{ evaluationStatusLabel }}
          </el-tag>
        </div>
      </div>
    </div>

    <div class="evaluation-form-section">
      <div class="evaluation-form-card">
        <template v-if="isSelectionReady && isEvaluationStage">
          <el-alert
            v-if="!currentStageId"
            title="Не удалось определить текущий этап. Обновите данные, чтобы загрузить и сохранить оценку именно для активного этапа."
            type="warning"
            :closable="false"
            show-icon
            class="form-status"
          />

          <el-alert
            v-else-if="evaluationLoadError"
            :title="evaluationLoadError"
            type="warning"
            :closable="false"
            show-icon
            class="form-status"
          />

          <el-alert
            v-else-if="evaluationLoading"
            title="Загружаем оценку выбранной команды для текущего этапа..."
            type="info"
            :closable="false"
            show-icon
            class="form-status"
          />

          <el-alert
            v-else
            :title="existingEvaluation
              ? `Загружена сохраненная оценка: ${existingTotalScore}/50. Измените критерии и сохраните обновление.`
              : 'Для выбранной пары жюри и команды оценка пока не сохранена.'"
            :type="existingEvaluation ? 'success' : 'info'"
            :closable="false"
            show-icon
            class="form-status"
          />

          <h2 class="form-title">Критерии оценки</h2>

          <div class="criteria-list">
            <div
              v-for="n in 5"
              :key="n"
              class="criterion-item"
            >
              <div class="criterion-header">
                <span class="criterion-label">{{ getCriterionLabel(n) }}</span>
                <span class="criterion-score">{{ evaluation[`criterion_${n}`] }}/10</span>
              </div>

              <div class="score-controls">
                <el-slider
                  v-model="evaluation[`criterion_${n}`]"
                  :min="0"
                  :max="10"
                  :step="1"
                  :show-tooltip="true"
                  :format-tooltip="(val) => `${val}/10`"
                  class="score-slider"
                />

                <div class="quick-buttons">
                  <el-button
                    v-for="score in [0, 5, 7, 10]"
                    :key="score"
                    :type="evaluation[`criterion_${n}`] === score ? 'primary' : 'default'"
                    size="small"
                    @click="setScore(n, score)"
                    class="quick-score-btn"
                  >
                    {{ score }}
                  </el-button>
                </div>
              </div>
            </div>
          </div>

          <div class="total-score-section">
            <div class="total-score-card">
              <span class="total-label">Итоговая оценка:</span>
              <span class="total-value">{{ totalScore }} / 50</span>
            </div>
          </div>

          <div class="form-actions">
            <el-button
              type="primary"
              size="large"
              @click="submitEvaluation"
              :loading="saving"
              :disabled="saving || evaluationLoading || !currentStageId || Boolean(evaluationLoadError)"
              class="submit-btn"
            >
              {{ saving ? 'Сохранение...' : (existingEvaluation ? 'Сохранить изменения' : 'Сохранить оценку') }}
            </el-button>
          </div>
        </template>

        <div v-else class="empty-form-state">
          <el-empty description="Сначала выберите жюри и команду" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Link } from '@element-plus/icons-vue'
import { evaluationsApi } from '@/api/evaluations'
import { eventsApi } from '@/api/events'
import { teamsApi } from '@/api/teams'
import { useStageStore } from '@/stores/stage'

const createEmptyEvaluation = () => ({
  criterion_1: 0,
  criterion_2: 0,
  criterion_3: 0,
  criterion_4: 0,
  criterion_5: 0
})

const loading = ref(false)
const saving = ref(false)
const activeEvent = ref(null)
const judges = ref([])
const teams = ref([])
const selectedJudgeId = ref(null)
const selectedTeamId = ref(null)
const evaluation = ref(createEmptyEvaluation())
const loadWarning = ref('')
const evaluationLoading = ref(false)
const evaluationLoadError = ref('')
const currentStageEvaluation = ref(null)
const selectedEvaluationRequestId = ref(0)

const stageStore = useStageStore()

const isSameId = (left, right) => {
  if (left === null || left === undefined || right === null || right === undefined) {
    return false
  }

  return String(left) === String(right)
}

const normalizeEvaluation = (item) => ({
  ...item,
  criterion_1: Number(item?.criterion_1 ?? 0),
  criterion_2: Number(item?.criterion_2 ?? 0),
  criterion_3: Number(item?.criterion_3 ?? 0),
  criterion_4: Number(item?.criterion_4 ?? 0),
  criterion_5: Number(item?.criterion_5 ?? 0)
})

const normalizeTeam = (team) => {
  const teamId = team?.team_id ?? team?.id

  return {
    team_id: teamId,
    team_name: team?.team_name ?? team?.name ?? `Команда ${teamId}`,
    team_motto: team?.team_motto ?? '',
    solution_link: team?.solution_link ?? '',
    evaluations: Array.isArray(team?.evaluations)
      ? team.evaluations.map(normalizeEvaluation)
      : []
  }
}

const selectedJudge = computed(() => {
  return judges.value.find(judge => isSameId(judge.judge_id, selectedJudgeId.value)) || null
})

const selectedTeam = computed(() => {
  return teams.value.find(team => isSameId(team.team_id, selectedTeamId.value)) || null
})

const currentStageId = computed(() => stageStore.currentStage?.id ?? null)
const isEvaluationStage = computed(() => {
  const stageType = stageStore.currentStage?.type

  return [
    'online_defense',
    'on_site_defense',
    'solution_review'
  ].includes(stageType)
})

const existingEvaluation = computed(() => {
  return currentStageEvaluation.value
})

const existingTotalScore = computed(() => {
  if (!existingEvaluation.value) {
    return 0
  }

  return Number(existingEvaluation.value.total_score ?? (
    existingEvaluation.value.criterion_1 +
    existingEvaluation.value.criterion_2 +
    existingEvaluation.value.criterion_3 +
    existingEvaluation.value.criterion_4 +
    existingEvaluation.value.criterion_5
  ))
})

const isSelectionReady = computed(() => {
   return Boolean(selectedJudge.value && selectedTeam.value)
})

const evaluationStatusLabel = computed(() => {
  if (evaluationLoading.value) {
    return 'Загрузка оценки'
  }

  if (existingEvaluation.value) {
    return 'Редактирование оценки'
  }

  return 'Новая оценка'
})

const evaluationStatusType = computed(() => {
  if (evaluationLoading.value) {
    return 'warning'
  }

  return existingEvaluation.value ? 'success' : 'info'
})

const totalScore = computed(() => {
  return Object.values(evaluation.value).reduce((sum, score) => sum + Number(score || 0), 0)
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

const setScore = (criterionNumber, score) => {
  evaluation.value[`criterion_${criterionNumber}`] = score
}

const applySelectedEvaluation = () => {
  if (!isSelectionReady.value) {
    currentStageEvaluation.value = null
    evaluation.value = createEmptyEvaluation()
    return
  }

  if (existingEvaluation.value) {
    evaluation.value = {
      criterion_1: existingEvaluation.value.criterion_1,
      criterion_2: existingEvaluation.value.criterion_2,
      criterion_3: existingEvaluation.value.criterion_3,
      criterion_4: existingEvaluation.value.criterion_4,
      criterion_5: existingEvaluation.value.criterion_5
    }
    return
  }

  evaluation.value = createEmptyEvaluation()
}

const normalizeTeamEvaluationsResponse = (response) => {
  if (Array.isArray(response)) {
    return response
  }

  if (Array.isArray(response?.evaluations)) {
    return response.evaluations
  }

  if (Array.isArray(response?.team?.evaluations)) {
    return response.team.evaluations
  }

  return []
}

const restoreSelection = (judgeId, teamId) => {
  selectedJudgeId.value = judges.value.some(judge => isSameId(judge.judge_id, judgeId)) ? judgeId : null
  selectedTeamId.value = teams.value.some(team => isSameId(team.team_id, teamId)) ? teamId : null
}

const loadActiveEvent = async () => {
  try {
    activeEvent.value = await eventsApi.getActiveEvent()
  } catch (error) {
    console.warn('Active event is unavailable for score entry:', error)
    activeEvent.value = null
  }
}

const ensureCurrentStage = async () => {
  if (stageStore.currentStage?.id) {
    return stageStore.currentStage
  }

  try {
    return await stageStore.updateStageInfo()
  } catch (error) {
    console.warn('Current stage is unavailable for score entry:', error)
    return null
  }
}

const loadJudges = async () => {
  if (!activeEvent.value?.id) {
    judges.value = []
    return
  }

  const response = await eventsApi.getEventJudges(activeEvent.value.id)
  const eventJudges = Array.isArray(response?.judges) ? response.judges : []

  judges.value = eventJudges.map(judge => ({
    judge_id: judge.id,
    judge_name: judge.full_name,
    judge_email: judge.email
  }))
}

const loadTeams = async () => {
  const [detailedResult, allTeamsResult] = await Promise.allSettled([
    evaluationsApi.getDetailedEvaluations(),
    teamsApi.getAllTeams()
  ])

  const teamMap = new Map()
  let detailedEvaluationsUnavailable = false

  if (allTeamsResult.status === 'fulfilled') {
    const allTeams = Array.isArray(allTeamsResult.value)
      ? allTeamsResult.value
      : (Array.isArray(allTeamsResult.value?.teams) ? allTeamsResult.value.teams : [])

    allTeams
      .map(normalizeTeam)
      .filter(team => team.team_id !== undefined && team.team_id !== null)
      .forEach(team => {
        teamMap.set(String(team.team_id), team)
      })
  }

  if (detailedResult.status === 'fulfilled') {
    const detailedTeams = Array.isArray(detailedResult.value)
      ? detailedResult.value
      : (Array.isArray(detailedResult.value?.teams) ? detailedResult.value.teams : [])

    detailedTeams
      .map(normalizeTeam)
      .filter(team => team.team_id !== undefined && team.team_id !== null)
      .forEach(team => {
        const existingTeam = teamMap.get(String(team.team_id)) || {}

        teamMap.set(String(team.team_id), {
          ...existingTeam,
          ...team,
          evaluations: team.evaluations
        })
      })
  } else {
    detailedEvaluationsUnavailable = true
  }

  if (teamMap.size === 0) {
    throw new Error('Не удалось загрузить список команд')
  }

  loadWarning.value = detailedEvaluationsUnavailable
    ? 'Не удалось загрузить расширенные данные по оценкам. Список команд доступен, но часть дополнительной информации может временно не отображаться.'
    : ''

  teams.value = Array.from(teamMap.values()).sort((left, right) => left.team_name.localeCompare(right.team_name, 'ru'))
}

const loadSelectedTeamEvaluation = async () => {
  const requestId = selectedEvaluationRequestId.value + 1
  selectedEvaluationRequestId.value = requestId
  evaluationLoadError.value = ''

  if (!isSelectionReady.value) {
    evaluationLoading.value = false
    applySelectedEvaluation()
    return
  }

  if (!currentStageId.value) {
    evaluationLoading.value = false
    currentStageEvaluation.value = null
    evaluation.value = createEmptyEvaluation()
    return
  }

  try {
    evaluationLoading.value = true
    currentStageEvaluation.value = null
    evaluation.value = createEmptyEvaluation()

    const response = await evaluationsApi.getTeamEvaluations(selectedTeam.value.team_id)

    if (requestId !== selectedEvaluationRequestId.value) {
      return
    }

    const teamEvaluations = normalizeTeamEvaluationsResponse(response).map(normalizeEvaluation)

    currentStageEvaluation.value = teamEvaluations.find(item => (
      isSameId(item.judge_id, selectedJudge.value?.judge_id) &&
      isSameId(item.stage_id, currentStageId.value)
    )) || null

    applySelectedEvaluation()
  } catch (error) {
    if (requestId !== selectedEvaluationRequestId.value) {
      return
    }

    console.error('Error loading team evaluations for score entry:', error)
    currentStageEvaluation.value = null
    evaluation.value = createEmptyEvaluation()
    evaluationLoadError.value = 'Не удалось загрузить оценку команды для текущего этапа. Обновите данные и попробуйте снова.'
  } finally {
    if (requestId === selectedEvaluationRequestId.value) {
      evaluationLoading.value = false
    }
  }
}

const refreshData = async ({ preserveSelection = true, showMessage = false } = {}) => {
  const previousJudgeId = preserveSelection ? selectedJudgeId.value : null
  const previousTeamId = preserveSelection ? selectedTeamId.value : null

  try {
    loading.value = true
    loadWarning.value = ''
    evaluationLoadError.value = ''

    await ensureCurrentStage()
    await loadActiveEvent()
    await Promise.all([
      loadJudges(),
      loadTeams()
    ])

    restoreSelection(previousJudgeId, previousTeamId)

    if (showMessage) {
      ElMessage.success('Данные вкладки обновлены')
    }

    return true
  } catch (error) {
    console.error('Error loading admin judge evaluations:', error)
    ElMessage.error(error?.detail || error?.message || 'Ошибка при загрузке данных для выставления оценок')
    return false
  } finally {
    loading.value = false
  }
}

const submitEvaluation = async () => {
    if (!selectedTeam.value || !selectedJudge.value) {
      ElMessage.warning('Выберите жюри и команду')
      return
    }

    if (!isEvaluationStage.value) {
      ElMessage.warning('Ввод оценок сейчас недоступен: активный этап не предназначен для оценивания')
      return
    }

  try {
    saving.value = true
    const wasEditing = Boolean(existingEvaluation.value)

    await evaluationsApi.createEvaluation({
      team_id: selectedTeam.value.team_id,
      judge_id: selectedJudge.value.judge_id,
      ...evaluation.value
    })

    const refreshed = await refreshData({ preserveSelection: true, showMessage: false })

    ElMessage.success(wasEditing ? 'Оценка успешно обновлена' : 'Оценка успешно сохранена')

    if (!refreshed) {
      ElMessage.warning('Оценка сохранена, но данные вкладки не удалось обновить автоматически')
    }
  } catch (error) {
    console.error('Error saving evaluation:', error)
    ElMessage.error(error?.detail || error?.message || 'Ошибка при сохранении оценки')
  } finally {
    saving.value = false
  }
}

watch([selectedJudgeId, selectedTeamId, teams], () => {
  loadSelectedTeamEvaluation()
}, { immediate: true })

watch(currentStageId, () => {
  loadSelectedTeamEvaluation()
}, { immediate: true })

onMounted(() => {
  refreshData()
})
</script>

<style scoped>
.judge-score-entry-tab {
  --surface-primary: #ffffff;
  --surface-muted: #f5f7fa;
  --surface-subtle: #f8fafc;
  --border-color: #e4e7ed;
  --text-primary: #303133;
  --text-secondary: #606266;
  --text-muted: #909399;
  --radius-card: 12px;
  --radius-panel: 8px;
  --space-sm: 12px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;

  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  min-height: 100%;
}

.selection-card,
.team-context-card,
.evaluation-form-card {
  background: var(--surface-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-card);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.selection-card {
  padding: var(--space-lg);
}

.selection-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.section-title,
.form-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
}

.section-description {
  margin: 8px 0 0;
  color: var(--text-secondary);
  line-height: 1.5;
}

.selection-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-md);
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label,
.context-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.option-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  line-height: 1.35;
}

.option-secondary,
.judge-email {
  font-size: 12px;
  color: var(--text-muted);
}

.status-alert {
  margin-top: var(--space-md);
}

.team-context-card {
  padding: var(--space-lg);
}

.team-context-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-lg);
}

.team-context-info,
.team-context-side,
.judge-summary {
  display: flex;
  flex-direction: column;
}

.team-context-info {
  gap: 8px;
  min-width: 0;
}

.team-context-side {
  gap: var(--space-sm);
  align-items: flex-end;
  text-align: right;
}

.team-name,
.judge-name {
  margin: 0;
  color: var(--text-primary);
}

.team-name {
  font-size: 28px;
  font-weight: 600;
}

.judge-name {
  font-size: 16px;
}

.team-motto {
  margin: 0;
  color: var(--text-secondary);
  font-style: italic;
}

.solution-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: fit-content;
}

.evaluation-form-card {
  padding: var(--space-xl);
}

.form-status {
  margin-bottom: var(--space-lg);
}

.form-title {
  margin-bottom: var(--space-xl);
}

.criteria-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
  margin-bottom: var(--space-xl);
}

.criterion-item {
  padding-bottom: var(--space-xl);
  border-bottom: 1px solid var(--border-color);
}

.criterion-item:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.criterion-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
}

.criterion-label {
  flex: 1;
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.5;
}

.criterion-score {
  min-width: 60px;
  text-align: right;
  font-size: 20px;
  font-weight: 600;
  color: #409eff;
}

.score-controls {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.score-slider {
  width: 100%;
}

.quick-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.quick-score-btn {
  min-width: 50px;
}

.total-score-section {
  margin: var(--space-xl) 0;
  padding-top: var(--space-lg);
  border-top: 2px solid var(--border-color);
}

.total-score-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-md);
  padding: 20px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: var(--radius-card);
  color: #ffffff;
}

.total-label {
  font-size: 18px;
  font-weight: 500;
}

.total-value {
  font-size: 32px;
  font-weight: 700;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: var(--space-lg);
  border-top: 1px solid var(--border-color);
}

.submit-btn {
  min-width: 220px;
  height: 48px;
  font-size: 16px;
  border: none;
  background: linear-gradient(90deg, #00a3ff 0%, #5b51d8 100%);
}

.submit-btn:hover {
  opacity: 0.92;
}

.empty-form-state {
  padding: var(--space-xl) 0;
}

@media (max-width: 768px) {
  .judge-score-entry-tab {
    gap: var(--space-sm);
    padding-bottom: 20px;
  }

  .selection-card,
  .team-context-card,
  .evaluation-form-card {
    border-radius: var(--radius-panel);
    box-shadow: none;
  }

  .selection-card,
  .team-context-card,
  .evaluation-form-card {
    padding: var(--space-md);
  }

  .selection-header,
  .team-context-main,
  .criterion-header,
  .total-score-card {
    flex-direction: column;
    align-items: stretch;
  }

  .selection-grid {
    grid-template-columns: 1fr;
  }

  .section-title,
  .form-title {
    font-size: 18px;
  }

  .team-context-side {
    align-items: flex-start;
    text-align: left;
  }

  .team-name {
    font-size: 20px;
  }

  .criterion-label {
    font-size: 15px;
  }

  .criterion-score {
    text-align: left;
    min-width: 0;
  }

  .quick-buttons {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .quick-score-btn {
    min-width: 0;
  }

  .total-value {
    font-size: 28px;
  }

  .form-actions {
    justify-content: stretch;
  }

  .submit-btn {
    width: 100%;
  }
}
</style>
