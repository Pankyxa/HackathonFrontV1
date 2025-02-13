<template>
  <div v-if="isLoading" class="global-loader-container">
    <div class="global-loader">
      <div class="loader-content">
        <el-icon class="loading-icon"><Loading /></el-icon>
        <span class="loading-text">Загрузка...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useLoadingStore } from '@/stores/loading'
import { Loading } from '@element-plus/icons-vue'

const store = useLoadingStore()
const { isLoading } = storeToRefs(store)
</script>

<style scoped>
.global-loader-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.global-loader {
  text-align: center;
}

.loader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.loading-icon {
  font-size: 32px;
  color: white;
  animation: rotate 1s linear infinite;
}

.loading-text {
  color: white;
  font-size: 16px;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>