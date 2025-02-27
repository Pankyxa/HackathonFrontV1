<template>
  <div class="stages-container">
    <div class="stages-content">
      <h2 class="stages-title">Управление этапами</h2>

      <div v-if="isLoading" class="loading">
        <el-skeleton :rows="5" animated/>
      </div>

      <div v-else-if="error" class="error">
        {{ error }}
      </div>

      <div v-else class="stages-list">
        <div
            v-for="stage in stages"
            :key="stage.id"
            class="stage-item"
            :class="{ active: stage.is_active }"
        >
          <div class="stage-info">
            <h3>{{ stage.name }}</h3>
            <p>Порядковый номер: {{ stage.order }}</p>
          </div>

          <template v-if="stage.order === 2">
            <h3>Данный этап ставится автоматически</h3>
          </template>
          <template v-else>
            <el-button
                v-if="!stage.is_active"
                class="activate-button"
                @click="activateStage(stage.id)"
                :loading="activating"
            >
              Активировать
            </el-button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { stagesApi } from '@/api/stages'
import { useStageStore } from '@/stores/stage'
import { ElSkeleton, ElButton } from 'element-plus'

const stages = ref([])
const isLoading = ref(false)
const error = ref(null)
const activating = ref(false)

const stageStore = useStageStore()

async function loadStages() {
  try {
    isLoading.value = true
    error.value = null
    stages.value = await stagesApi.getAllStages()
  } catch (err) {
    error.value = err.response?.data?.detail || 'Ошибка при загрузке этапов'
    console.error('Error loading stages:', err)
  } finally {
    isLoading.value = false
  }
}

async function activateStage(stageId) {
  try {
    activating.value = true
    await stagesApi.setStage(stageId)
    await loadStages()
    await stageStore.fetchCurrentStage()
  } catch (err) {
    error.value = err.response?.data?.detail || 'Ошибка при активации этапа'
    console.error('Error activating stage:', err)
  } finally {
    activating.value = false
  }
}

onMounted(loadStages)
</script>

<style scoped>
.stages-container {
  margin-top: 20px;
  flex: 1;
  display: flex;
  height: calc(100% - 42px);
  flex-direction: column;
  width: 100%;
}

.stages-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 20px;
}

.stages-title {
  margin-bottom: 20px;
  color: #333333;
  font-size: 24px;
}

.stages-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stage-info {
  color: #333333;
}

.stage-info h3 {
  margin: 0;
  font-size: 18px;
  margin-bottom: 4px;
}

h3 {
  color: #333333;
}

.stage-info p {
  margin: 0;
  color: #666666;
}

.stage-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: white;
  transition: all 0.3s ease;
}

.stage-item:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.activate-button {
  background: white;
  color: #5B51D8;
  border: 2px solid #5B51D8;
  border-radius: 4px;
}

.activate-button:hover {
  background: #5B51D8;
  color: white;
}

.stage-item.active {
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid #4CAF50;
}

.error {
  color: var(--el-color-danger);
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 4px;
  background: var(--el-color-danger-light-9);
}

.loading {
  padding: 20px;
}

@media (max-width: 768px) {
  .stages-container {
    height: auto;
    min-height: 100%;
  }

  .stages-content {
    padding: 0 10px;
  }

  .stage-item {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .stage-info {
    width: 100%;
  }
}
</style>