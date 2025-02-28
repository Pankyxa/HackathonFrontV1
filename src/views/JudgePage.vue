<template>
  <TheHeader/>
  <div class="judge-page">
    <el-tabs v-model="activeTab" class="tabs-container">
      <el-tab-pane label="Неоцененные работы" name="unevaluated">
        <UnevaluatedTeamsTab/>
      </el-tab-pane>

      <el-tab-pane label="Оцененные работы" name="evaluated">
        <EvaluatedTeamsTab/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TheHeader from "@/components/TheHeader.vue"
import UnevaluatedTeamsTab from "@/components/judge/UnevaluatedTeamsTab.vue"
import EvaluatedTeamsTab from "@/components/judge/EvaluatedTeamsTab.vue"

const activeTab = ref('unevaluated')
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
@media (max-width: 768px) {
  .judge-page {
    height: auto;
    min-height: calc(100vh - 316px);
  }
}
</style>