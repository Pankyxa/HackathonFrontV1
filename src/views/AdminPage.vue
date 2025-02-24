<template>
  <TheHeader/>
  <div class="admin-page">
    <el-tabs v-model="activeTab" class="tabs-container">
      <el-tab-pane label="Пользователи" name="users">
        <UsersTab/>
      </el-tab-pane>

      <el-tab-pane label="Команды" name="teams">
        <TeamsTab/>
      </el-tab-pane>
    </el-tabs>
  </div>
  <TheFooter/>
</template>

<script setup>
import { ref } from 'vue'
import TheHeader from "@/components/TheHeader.vue"
import TheFooter from "@/components/TheFooter.vue"
import UsersTab from "@/components/admin/UsersTab.vue"
import TeamsTab from "@/components/admin/TeamsTab.vue"

const activeTab = ref('users')
</script>

<style scoped>
.admin-page {
  width: 100%;
  padding: 105px 20px 15px;
  height: calc(100vh - 196px);
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
  .admin-page {
    height: auto;
    min-height: calc(100vh - 316px);
  }
}
</style>