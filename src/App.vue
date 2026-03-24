<template>
  <div class="app-wrapper">
    <GlobalLoader />
    <RouterView />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useStageStore } from "@/stores/stage.js"
import GlobalLoader from '@/components/GlobalLoader.vue'

const authStore = useAuthStore()
const stageStore = useStageStore()

onMounted(() => {
  authStore.initializeAuth()
  stageStore.initializeStage()
})
</script>

<style>
.app-wrapper {
  min-height: 100vh;
  width: 100%;
}

/* Глобальные стили для заголовков */
h1, h2, h3 {
  color: #111827; /* text-gray-900 */
  font-weight: 600;
}

a {
  text-decoration: none;
  color: inherit;
}

:root {
  --el-color-primary: #409EFF;
}
</style>
