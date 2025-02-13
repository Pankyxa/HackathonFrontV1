<template>
  <el-container class="layout-container">
    <el-main>
      <GlobalLoader />
      <RouterView />
    </el-main>
  </el-container>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import GlobalLoader from '@/components/GlobalLoader.vue'

const authStore = useAuthStore()

onMounted(() => {
  authStore.initializeAuth()
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
