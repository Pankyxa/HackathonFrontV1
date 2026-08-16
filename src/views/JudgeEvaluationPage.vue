<template>
  <TheHeader :class="{ 'header-hidden': isHeaderHidden }"/>
  <div class="judge-evaluation-page" v-loading="loading">
    <div class="evaluation-container">
      <!-- Заголовок с информацией о команде -->
      <div class="team-header-section">
        <div class="team-header-content">
          <el-avatar
            :size="isMobile ? 60 : 80"
            :src="teamLogoUrl"
            class="team-logo"
          >
            <el-icon :size="isMobile ? 30 : 40"><User /></el-icon>
          </el-avatar>
          <div class="team-info">
            <h1 class="team-name">{{ team?.team_name || 'Загрузка...' }}</h1>
            <p class="team-motto" v-if="team?.team_motto">{{ team.team_motto }}</p>
            <el-link
              v-if="team?.solution_link"
              type="primary"
              :href="team.solution_link"
              target="_blank"
              class="solution-link-header"
            >
              <el-icon><Link /></el-icon>
              Решение на GitHub
            </el-link>
          </div>
        </div>
        <el-button
          type="default"
          :icon="ArrowLeft"
          @click="goBack"
          class="back-button"
        >
          Назад к списку
        </el-button>
      </div>

      <div class="evaluation-content">
        <!-- Форма оценки -->
        <div class="evaluation-form-section">
          <div class="evaluation-form-card">
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
                
                <!-- Слайдер для оценки -->
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
                  
                  <!-- Быстрые кнопки для часто используемых значений -->
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

            <!-- Итоговая оценка -->
            <div class="total-score-section">
              <div class="total-score-card">
                <span class="total-label">Итоговая оценка:</span>
                <span class="total-value">{{ totalScore }} / 50</span>
              </div>
            </div>

            <!-- Кнопки действий -->
            <div class="form-actions">
              <el-button
                type="default"
                size="large"
                @click="goBack"
                class="cancel-btn"
              >
                Отмена
              </el-button>
              <el-button
                type="primary"
                size="large"
                @click="submitEvaluation"
                :loading="saving"
                :disabled="saving"
                class="submit-btn"
              >
                {{ saving ? 'Сохранение...' : (isEdit ? 'Сохранить изменения' : 'Сохранить оценку') }}
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, User, Link } from '@element-plus/icons-vue'
import TheHeader from '@/components/TheHeader.vue'
import { evaluationsApi } from '@/api/evaluations'
import { teamsApi } from '@/api/teams'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const saving = ref(false)
const team = ref(null)
const isMobile = computed(() => window.innerWidth <= 768)

// Переменные для скрытия хедера при скролле
const isHeaderHidden = ref(false)
const lastScrollPosition = ref(0)
const scrollThreshold = 10

const evaluation = ref({
  criterion_1: 0,
  criterion_2: 0,
  criterion_3: 0,
  criterion_4: 0,
  criterion_5: 0
})

const isEdit = ref(false)

const teamLogoUrl = computed(() => {
  if (!team.value?.team_id) return ''
  return `${import.meta.env.VITE_API_URL}/teams/${team.value.team_id}/logo`
})

const totalScore = computed(() => {
  return Object.values(evaluation.value).reduce((sum, score) => sum + score, 0)
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

const loadTeam = async () => {
  const teamId = route.params.teamId
  if (!teamId) {
    ElMessage.error('ID команды не указан')
    router.push('/judge/teams')
    return
  }

  try {
    loading.value = true
    // Загружаем информацию о команде через эндпоинт для жюри
    const teamData = await teamsApi.getJudgeTeamInfo(teamId)
    team.value = {
      team_id: teamId,
      team_name: teamData.team_name,
      team_motto: teamData.team_motto,
      solution_link: teamData.solution_link
    }

    // Проверяем, есть ли уже оценка от текущего жюри
    try {
      const myEvaluations = await evaluationsApi.getMyEvaluations()
      const existingEvaluation = myEvaluations.find(e => e.team_id === teamId)
      
      if (existingEvaluation) {
        isEdit.value = true
        evaluation.value = {
          criterion_1: existingEvaluation.criterion_1 || 0,
          criterion_2: existingEvaluation.criterion_2 || 0,
          criterion_3: existingEvaluation.criterion_3 || 0,
          criterion_4: existingEvaluation.criterion_4 || 0,
          criterion_5: existingEvaluation.criterion_5 || 0
        }
      }
    } catch (error) {
      console.log('Оценка не найдена, создаем новую')
    }
  } catch (error) {
    console.error('Error loading team:', error)
    ElMessage.error('Ошибка при загрузке информации о команде')
    router.push('/judge/teams')
  } finally {
    loading.value = false
  }
}

const submitEvaluation = async () => {
  if (!team.value?.team_id) return

  try {
    saving.value = true
    const payload = {
      team_id: team.value.team_id,
      ...evaluation.value
    }
    if (authStore.user?.id) {
      payload.judge_id = authStore.user.id
    }
    await evaluationsApi.createEvaluation(payload)

    ElMessage({
      message: isEdit.value ? 'Оценка успешно обновлена' : 'Оценка успешно сохранена',
      type: 'success'
    })

    // Возвращаемся к списку команд с параметром для обновления
    router.push({ path: '/judge/teams', query: { from: 'evaluation' } })
  } catch (error) {
    console.error('Error submitting evaluation:', error)
    ElMessage({
      message: error.detail || 'Ошибка при сохранении оценки',
      type: 'error'
    })
  } finally {
    saving.value = false
  }
}

const goBack = () => {
  router.push('/judge/teams')
}

const handleScroll = () => {
  const currentScrollPosition = window.scrollY;

  if (Math.abs(currentScrollPosition - lastScrollPosition.value) < scrollThreshold) {
    return;
  }

  isHeaderHidden.value = currentScrollPosition > lastScrollPosition.value && currentScrollPosition > 100;
  lastScrollPosition.value = currentScrollPosition;
};

onMounted(() => {
  loadTeam()
  window.addEventListener('scroll', handleScroll, { passive: true });
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
})
</script>

<style scoped>
.judge-evaluation-page {
  min-height: 100vh;
  background: #f8fafc; /* bg-slate-50 */
  padding: 96px 20px 20px; /* pt-24 для отступа под хедер */
}

.evaluation-container {
  max-width: 1400px;
  margin: 0 auto;
}

.team-header-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.team-header-content {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
}

.team-logo {
  flex-shrink: 0;
  border: 3px solid #e4e7ed;
  width: 80px;
  height: 80px;
}

.team-info {
  flex: 1;
  min-width: 0;
}

.team-name {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
  color: #303133;
}

.team-motto {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #909399;
  font-style: italic;
}

.solution-link-header {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  margin-top: 8px;
}

.back-button {
  flex-shrink: 0;
}

.evaluation-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.evaluation-form-section {
  flex: 1;
  min-width: 0;
  max-width: 100%;
}

.solution-collapse {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.collapse-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.solution-content {
  padding: 16px;
}

.solution-link-block {
  margin-bottom: 20px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.solution-link-block h4 {
  margin: 0 0 12px 0;
  color: #303133;
  font-size: 16px;
}

.solution-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  word-break: break-all;
  font-size: 14px;
}

.evaluation-form-card {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  max-width: 100%;
}

.form-title {
  margin: 0 0 32px 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.criteria-list {
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-bottom: 32px;
}

.criterion-item {
  padding-bottom: 32px;
  border-bottom: 1px solid #e4e7ed;
}

.criterion-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.criterion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.criterion-label {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  flex: 1;
}

.criterion-score {
  font-size: 20px;
  font-weight: 600;
  color: #409eff;
  min-width: 60px;
  text-align: right;
}

.score-controls {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.score-slider {
  width: 100%;
}

.quick-buttons {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.quick-score-btn {
  min-width: 50px;
}

.total-score-section {
  margin: 32px 0;
  padding-top: 24px;
  border-top: 2px solid #e4e7ed;
}

.total-score-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
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
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e4e7ed;
  width: 100%;
  box-sizing: border-box;
}

.cancel-btn,
.submit-btn {
  min-width: 160px;
  height: 48px;
  font-size: 16px;
}

.submit-btn {
  background: linear-gradient(90deg, #00A3FF 0%, #5B51D8 100%);
  border: none;
}

.submit-btn:hover {
  opacity: 0.9;
}


@media (max-width: 768px) {
  .judge-evaluation-page {
    padding: 70px 0 0 0;
    background: white;
  }

  .evaluation-container {
    max-width: 100%;
    padding: 0;
  }

  .team-header-section {
    flex-direction: column;
    align-items: stretch;
    padding: 12px 16px;
    gap: 12px;
    margin-bottom: 0;
    border-radius: 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .team-header-content {
    width: 100%;
    gap: 12px;
  }

  .team-logo {
    width: 50px !important;
    height: 50px !important;
  }

  .team-name {
    font-size: 18px;
    margin: 0 0 4px 0;
    line-height: 1.3;
  }

  .team-motto {
    font-size: 13px;
    line-height: 1.4;
  }

  .back-button {
    width: 100%;
    margin-top: 0;
    height: 40px;
    font-size: 14px;
  }

  .evaluation-content {
    gap: 0;
    padding: 0;
  }

  .evaluation-form-section {
    flex: 1;
    max-width: 100%;
    padding: 16px;
  }

  .evaluation-form-card {
    padding: 16px;
    border-radius: 0;
    box-shadow: none;
    background: white;
  }

  .form-title {
    font-size: 18px;
    margin-bottom: 20px;
    font-weight: 600;
  }

  .criteria-list {
    gap: 24px;
    margin-bottom: 24px;
  }

  .criterion-item {
    padding-bottom: 24px;
    border-bottom: 1px solid #f0f0f0;
  }

  .criterion-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .criterion-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 16px;
  }

  .criterion-label {
    font-size: 15px;
    line-height: 1.5;
    flex: 1;
    min-width: 0;
    font-weight: 500;
    color: #303133;
  }

  .criterion-score {
    font-size: 20px;
    text-align: right;
    min-width: 55px;
    flex-shrink: 0;
    font-weight: 600;
    color: #409eff;
  }

  .score-controls {
    gap: 16px;
  }

  .score-slider {
    width: 100%;
    margin: 0;
  }

  .quick-buttons {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    width: 100%;
  }

  .quick-score-btn {
    min-width: auto;
    width: 100%;
    padding: 10px;
    font-size: 15px;
    font-weight: 500;
    height: 44px;
  }

  .total-score-section {
    margin: 32px 0 24px;
    padding-top: 20px;
  }

  .total-score-card {
    padding: 20px 16px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    border-radius: 12px;
  }

  .total-label {
    font-size: 16px;
    font-weight: 500;
  }

  .total-value {
    font-size: 36px;
    font-weight: 700;
  }

  .form-actions {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    margin: 0;
    padding: 12px 16px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.1);
    z-index: 100;
    border-top: 1px solid #e4e7ed;
    width: 100%;
    box-sizing: border-box;
  }

  .evaluation-form-card {
    padding-bottom: 120px;
  }

  .cancel-btn,
  .submit-btn {
    width: 100%;
    min-width: auto;
    height: 48px;
    font-size: 16px;
    font-weight: 500;
    border-radius: 8px;
    margin: 0;
    flex-shrink: 0;
  }

  .solution-link-header {
    font-size: 13px;
    margin-top: 6px;
  }
}
</style>
