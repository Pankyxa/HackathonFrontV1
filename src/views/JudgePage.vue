<template>
  <TheHeader/>
  <div class="judge-page">
    <div v-if="canJudge">
      <!-- Десктопная версия табов -->
      <el-tabs v-model="activeTab" class="tabs-container desktop-tabs">
        <el-tab-pane label="Неоцененные работы" name="unevaluated">
          <UnevaluatedTeamsTab
            ref="unevaluatedTeamsTab"
            @evaluation-updated="handleEvaluationUpdated"
          />
        </el-tab-pane>

        <el-tab-pane label="Оцененные работы" name="evaluated">
          <EvaluatedTeamsTab
            ref="evaluatedTeamsTab"
            @evaluation-updated="handleEvaluationUpdated"
          />
        </el-tab-pane>
      </el-tabs>

      <!-- Мобильная версия - dropdown -->
      <div class="mobile-tabs">
        <el-select
          v-model="activeTab"
          placeholder="Выберите раздел"
          style="width: 100%"
          class="tab-select"
        >
          <el-option label="Неоцененные работы" value="unevaluated" />
          <el-option label="Оцененные работы" value="evaluated" />
        </el-select>

        <div class="tab-content">
          <UnevaluatedTeamsTab
            v-if="activeTab === 'unevaluated'"
            ref="unevaluatedTeamsTab"
            @evaluation-updated="handleEvaluationUpdated"
          />
          <EvaluatedTeamsTab
            v-if="activeTab === 'evaluated'"
            ref="evaluatedTeamsTab"
            @evaluation-updated="handleEvaluationUpdated"
          />
        </div>
      </div>
    </div>
    <div v-else class="message-container">
      <el-alert
          title="Оценка работ пока недоступна"
          type="info"
          :closable="false"
          description="Вы сможете приступить к оценке работ после начала этапа проверки решений."
          show-icon
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onActivated, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import TheHeader from "@/components/TheHeader.vue"
import UnevaluatedTeamsTab from "@/components/judge/UnevaluatedTeamsTab.vue"
import EvaluatedTeamsTab from "@/components/judge/EvaluatedTeamsTab.vue"
import { useStageStore } from "@/stores/stage.js";

const stageStore = useStageStore();
const route = useRoute()
const activeTab = ref('unevaluated')
const evaluatedTeamsTab = ref(null)
const unevaluatedTeamsTab = ref(null)

const canJudge = computed(() => {
  return stageStore.isSolutionReview ||
      stageStore.isOnlineDefense ||
      stageStore.isOnSiteDefense ||
      stageStore.isResultsPublication ||
      stageStore.isAwardCeremony;
})

const handleEvaluationUpdated = async () => {
  try {
    // Даем время БД обновиться
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Ждем, пока компоненты будут готовы
    await nextTick();

    // Обновляем списки в правильном порядке
    if (evaluatedTeamsTab.value) {
      await evaluatedTeamsTab.value.loadTeams()
    }
    if (unevaluatedTeamsTab.value) {
      await unevaluatedTeamsTab.value.loadTeams()
    }
  } catch (error) {
    console.error('Error updating lists:', error)
  }
}

// Обновляем список при возврате на страницу
onActivated(() => {
  handleEvaluationUpdated()
})

// Обновляем список при монтировании, если вернулись с страницы оценки
onMounted(async () => {
  if (route.query.from === 'evaluation') {
    // Ждем, пока компонент смонтируется
    await nextTick()
    await handleEvaluationUpdated()
  }
})
</script>

<style scoped>
.judge-page {
  width: 100%;
  padding: 96px 20px 20px; /* pt-24 для отступа под хедер */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8fafc; /* bg-slate-50 */
}

.tabs-container {
  background: white;
  border-radius: 12px; /* rounded-xl */
  padding: 24px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  flex: 1;
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.message-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: 20px;
}

:deep(.el-tabs) {
  display: flex;
  height: 100%;
}

:deep(.el-tabs__content) {
  flex: 1;
  overflow: hidden;
}

:deep(.el-tab-pane) {
  height: 100%;
}

:deep(.el-alert) {
  width: 100%;
  max-width: 600px;
}

/* Мобильная версия - скрыта на десктопе */
.mobile-tabs {
  display: none;
}

.tab-select {
  margin-bottom: 16px;
}

.tab-content {
  flex: 1;
  overflow: hidden;
}

@media (max-width: 768px) {
  .judge-page {
    height: auto;
    min-height: calc(100vh - 316px);
    padding: 70px 0 0 0;
  }

  .desktop-tabs {
    display: none;
  }

  .mobile-tabs {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 0 16px;
    padding-top: 16px;
  }

  .tab-select {
    margin-bottom: 12px;
    position: sticky;
    top: 70px;
    z-index: 10;
    background: white;
    padding: 12px 0;
    margin-top: 8px;
  }

  .tab-content {
    flex: 1;
    overflow-y: auto;
  }
}
</style>