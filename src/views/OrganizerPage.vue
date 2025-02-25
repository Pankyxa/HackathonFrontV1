<template>
  <TheHeader/>
  <div class="organizer-page">
    <el-tabs v-model="activeTab" class="tabs-container">
      <el-tab-pane label="Проверить документы пользователей" name="check-documents">
        <CheckDocumentsTab/>
      </el-tab-pane>

      <el-tab-pane label="Оценки жюри" name="jury-scores">
        <div class="coming-soon">
          <el-empty description="Этот раздел находится в разработке"/>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TheHeader from "@/components/TheHeader.vue"
import TheFooter from "@/components/TheFooter.vue"
import CheckDocumentsTab from "@/components/organizer/CheckDocumentsTab.vue"

const activeTab = ref('check-documents')
</script>

<style scoped>
.organizer-page {
  width: 100%;
  padding: 105px 20px 20px;
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

.coming-soon {
  padding: 40px;
  text-align: center;
}

@media (max-width: 768px) {
  .organizer-page {
    height: auto;
    min-height: calc(100vh - 316px);
  }
}
</style>