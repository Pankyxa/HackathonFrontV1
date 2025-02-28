<template>
  <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? 'Изменение оценки' : 'Оценка команды'"
      :width="isMobile ? '95%' : '80%'"
      :close-on-click-modal="false"
      class="evaluation-dialog"
  >
    <div class="dialog-content">
      <div class="team-info">
        <div class="team-header">
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

        <div class="solution-files">
          <TeamSolution :team-id="team.team_id" :hide-upload="true"/>
        </div>
      </div>

      <div class="evaluation-form">
        <h4>Критерии оценки</h4>
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

const isMobile = computed(() => window.innerWidth <= 768)
onMounted(() => {
  console.log('Initial evaluation:', props.initialEvaluation) // Для отладки
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
  overflow-y: auto;
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

@media (max-width: 768px) {
  .dialog-content {
    flex-direction: column;
    height: auto;
    max-height: calc(80vh - 150px);
  }

  .evaluation-form {
    width: 100%;
  }
}
</style>