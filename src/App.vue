<template>
  <el-container class="layout-container">
    <el-main>
      <GlobalLoader />
      <CountdownTimer />
      <RouterView />
    </el-main>
  </el-container>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useStageStore } from "@/stores/stage.js"
import GlobalLoader from '@/components/GlobalLoader.vue'
import CountdownTimer from '@/components/CountdownTimer.vue'

const authStore = useAuthStore()
const stageStore = useStageStore()

onMounted(() => {
  authStore.initializeAuth()
  stageStore.initializeStage()
})
</script>

<style>
.layout-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.el-main {
  flex: 1;
  padding: 0;
  background-color: #ffffff;
  /* Удаляем padding-top, так как таймер теперь не влияет на поток документа */
}

a {
  text-decoration: none;
  color: inherit;
}

:root {
  --el-color-primary: #409EFF;
}

.layout-container {
  min-height: 100vh;
}

.el-main {
  flex: 1 0 auto;
}
</style>
