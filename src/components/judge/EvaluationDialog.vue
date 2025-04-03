<template>
  <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? 'Изменение оценки' : 'Оценка команды'"
      :width="isMobile ? '100%' : '80%'"
      :fullscreen="isMobile"
      :close-on-click-modal="false"
      class="evaluation-dialog"
  >
    <div v-if="isMobile" class="mobile-team-header">
      <div class="team-details-mobile">
            <h3>{{ team.team_name }}</h3>
            <p class="team-motto">{{ team.team_motto }}</p>
          </div>
        </div>

    <div class="dialog-content" :class="{ 'mobile': isMobile }">
      <div v-if="isMobile" class="mobile-tabs">
        <el-tabs v-model="activeTab" class="mobile-tabs-container">
          <el-tab-pane label="Оценка" name="evaluation"/>
          <el-tab-pane label="Информация" name="info"/>
        </el-tabs>
        </div>

      <div
        class="team-info"
        :class="{ 'mobile-hidden': isMobile && activeTab === 'evaluation' }"
      >
        <div v-if="!isMobile" class="team-header">
          <el-image
              v-if="team.logo_url"
              :src="team.logo_url"
              fit="cover"
              class="team-logo"
              />
          <div class="team-details">
            <h3>{{ team.team_name }}</h3>
            <p class="team-motto">{{ team.team_motto }}</p>
          </div>
        </div>
        <div class="solution-link-block">
          <h4>Ссылка на решение</h4>
          <el-link
              type="primary"
              :href="team.solution_link"
              target="_blank"
              class="solution-link"
          >
            <el-icon><Link /></el-icon>
            {{ team.solution_link }}
          </el-link>
    </div>
        <div class="solution-files">
          <TeamSolution :team-id="team.team_id" :hide-upload="true"/>
      </div>
      </div>

      <div
          class="evaluation-form"
          :class="{ 'mobile-hidden': isMobile && activeTab === 'info' }"
      >
        <h4>Критерии оценки</h4>
        <div class="evaluation-content">
          <div class="criteria-grid">
            <div v-for="n in 5" :key="n" class="form-group">
              <label>{{ getCriterionLabel(n) }}</label>
              <el-select
                  v-model="evaluation[`criterion_${n}`]"
                  class="form-input"
                  placeholder="Оценка"
              >
                <el-option
                    v-for="score in 11"
                    :key="score - 1"
                    :label="`${score - 1} баллов`"
                    :value="score - 1"
                />
              </el-select>
            </div>
          </div>
        </div>

        <div class="total-score">
          Итоговая оценка: {{ totalScore }} / 50
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <button class="cancel-btn" @click="handleClose">Отмена</button>
        <button class="save-btn" @click="submitEvaluation" :disabled="loading">
          {{ loading ? 'Сохранение...' : (isEdit ? 'Сохранить' : 'Оценить') }}
        </button>
      </div>
</template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import TeamSolution from '@/components/team/TeamSolution.vue'
import { evaluationsApi } from '@/api/evaluations'

const props = defineProps({
  visible: Boolean,
  team: Object,
  initialEvaluation: Object,
  isEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible', 'evaluation-submitted'])

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const loading = ref(false)
const evaluation = ref({
  criterion_1: 0,
  criterion_2: 0,
  criterion_3: 0,
  criterion_4: 0,
  criterion_5: 0
})

const activeTab = ref('evaluation')

const isMobile = computed(() => window.innerWidth <= 768)
onMounted(() => {
  if (props.initialEvaluation) {
    evaluation.value = {
      criterion_1: Number(props.initialEvaluation.criterion_1) || 0,
      criterion_2: Number(props.initialEvaluation.criterion_2) || 0,
      criterion_3: Number(props.initialEvaluation.criterion_3) || 0,
      criterion_4: Number(props.initialEvaluation.criterion_4) || 0,
      criterion_5: Number(props.initialEvaluation.criterion_5) || 0,
    }
  }
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

const handleClose = () => {
  dialogVisible.value = false
}

const submitEvaluation = async () => {
  try {
    loading.value = true
    await evaluationsApi.createEvaluation({
      team_id: props.team.team_id,
      ...evaluation.value
    })
    emit('evaluation-submitted')
    dialogVisible.value = false
    ElMessage({
      message: props.isEdit ? 'Оценка успешно обновлена' : 'Оценка успешно сохранена',
      type: 'success'
    })
  } catch (error) {
    console.error('Error submitting evaluation:', error)
    ElMessage({
      message: 'Ошибка при сохранении оценки',
      type: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.solution-link-block {
  background: #f8f9fa;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.solution-link-block h4 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 1em;
}

.solution-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  word-break: break-all;
  font-size: 0.9em;
}

.solution-link .el-icon {
  font-size: 16px;
}

.evaluation-dialog {
  display: flex;
  flex-direction: column;
}

.dialog-content {
  display: flex;
  gap: 24px;
  height: calc(80vh - 150px);
  overflow: hidden;
}

.team-info {
  flex: 1;
  overflow-y: auto;
  padding-right: 16px;
}

.team-header {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
}

.team-logo {
  width: 100px;
  height: 100px;
  border-radius: 8px;
}

.team-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.team-details h3 {
  margin: 0 0 8px 0;
  color: #333;
}

.team-motto {
  margin: 0;
  color: #666;
}

.evaluation-form {
  width: 400px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.evaluation-content {
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
}

.criteria-grid {
  margin-bottom: 16px;
}

.total-score {
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid #dcdfe6;
  font-weight: bold;
  text-align: right;
  color: #333;
  background: #f8f9fa;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.form-input {
  width: 100%;
}

.total-score {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #dcdfe6;
  font-weight: bold;
  text-align: right;
  color: #333;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem;
}

.cancel-btn {
  padding: 8px 20px;
  background: white;
  color: #606266;
  border: 1px solid #dcdfe6;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}

.save-btn {
  padding: 8px 20px;
  background: linear-gradient(90deg, #00A3FF 0%, #5B51D8 100%);
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-btn:hover {
  opacity: 0.9;
}

.save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.mobile-tabs {
  display: none;
}

.mobile-hidden {
  display: none !important;
}

.mobile-team-header {
  display: none;
  }

@media (max-width: 768px) {
  .mobile-team-header {
    display: flex;
    gap: 16px;
    padding: 16px;
    background: #f8f9fa;
    border-bottom: 1px solid #dcdfe6;
    margin: -16px -16px 0;
  }

  .team-details-mobile {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .team-details-mobile h3 {
    margin: 0 0 4px 0;
    color: #333;
    font-size: 16px;
  }

  .team-details-mobile .team-motto {
    margin: 0;
    color: #666;
    font-size: 14px;
  }

  .mobile-tabs {
    margin-top: 16px;
  }

  .team-header {
    display: none;
  }
    :deep(.el-dialog__body) {
    padding-top: 0;
    }

  .mobile-tabs {
    display: block;
    width: 100%;
    }

  .mobile-tabs-container {
    background: white;
    border-radius: 8px;
  }

  .dialog-content {
    height: auto;
    flex-direction: column;
    gap: 0;
}

  .dialog-content.mobile {
    padding: 0;
  }

  .team-info,
  .evaluation-form {
    width: 100%;
    max-height: calc(100vh - 250px);
    overflow-y: auto;
  }

  .evaluation-form {
    margin: 0;
    border-radius: 0;
    padding: 16px;
    background: white;
  }

  :deep(.el-dialog) {
    margin: 0 !important;
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  :deep(.el-dialog__header) {
    padding: 16px;
    margin: 0;
    border-bottom: 1px solid #dcdfe6;
  }

  :deep(.el-dialog__body) {
    padding: 16px;
    flex: 1;
    overflow: hidden;
  }

  :deep(.el-dialog__footer) {
    padding: 16px;
    border-top: 1px solid #dcdfe6;
    margin-top: auto;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-group label {
    font-size: 14px;
    line-height: 1.4;
  }

  .total-score {
    position: sticky;
    bottom: 0;
    background: white;
    padding: 16px;
    margin: 16px -16px -16px;
    border-top: 1px solid #dcdfe6;
  }

  @media (max-height: 667px) {
    .team-info,
    .evaluation-form {
      max-height: calc(100vh - 280px);
    }

    .form-group {
      margin-bottom: 16px;
    }

    :deep(.el-dialog__header) {
      padding: 12px 16px;
    }

    :deep(.el-dialog__body) {
      padding: 12px 16px;
    }

    :deep(.el-dialog__footer) {
      padding: 12px 16px;
    }
  }
}

@media (max-width: 768px) and (max-height: 667px) {
  .mobile-team-header {
    padding: 12px;
  }

  .team-details-mobile .team-motto {
    font-size: 13px;
  }
}
</style>