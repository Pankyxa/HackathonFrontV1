<template>
  <TheHeader/>
  <div class="judge-page">
    <div v-if="canJudge">
      <el-tabs v-model="activeTab" class="tabs-container">
        <el-tab-pane label="Неоцененные работы" name="unevaluated">
          <UnevaluatedTeamsTab/>
        </el-tab-pane>

        <el-tab-pane label="Оцененные работы" name="evaluated">
          <EvaluatedTeamsTab/>
        </el-tab-pane>
      </el-tabs>
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
import { ref, computed } from 'vue'
import TheHeader from "@/components/TheHeader.vue"
import UnevaluatedTeamsTab from "@/components/judge/UnevaluatedTeamsTab.vue"
import EvaluatedTeamsTab from "@/components/judge/EvaluatedTeamsTab.vue"
import { useStageStore } from "@/stores/stage.js";

const stageStore = useStageStore();
const activeTab = ref('unevaluated')

const canJudge = computed(() => {
  return stageStore.isSolutionReview ||
      stageStore.isOnlineDefense ||
      stageStore.isResultsPublication ||
      stageStore.isAwardCeremony;
})
</script>

<style scoped>
.judge-page {
  width: 100%;
  padding: 105px 20px 15px;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.tabs-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  flex: 1;
  display: flex;
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

@media (max-width: 768px) {
  .judge-page {
    height: auto;
    min-height: calc(100vh - 316px);
  }
}
</style>