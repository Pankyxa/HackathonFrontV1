<template>
  <el-container class="layout-container">
    <el-main>
      <RouterView />
    </el-main>
  </el-container>
</template>

<script setup>
import { RouterView } from 'vue-router'
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

/* Глобальные стили для Element Plus */
:root {
  --el-color-primary: #409EFF;
}

/* Обеспечиваем, чтобы footer всегда был внизу */
.layout-container {
  min-height: 100vh;
}

.el-main {
  flex: 1 0 auto;
}
</style>
