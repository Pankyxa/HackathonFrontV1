<template>
  <div class="primary-layout">
    <TheHeader />
    <main class="main-content">
      <slot></slot>
    </main>
    <TheFooter />
  </div>
</template>

<script setup>
import TheHeader from './TheHeader.vue'
import TheFooter from './TheFooter.vue'
</script>

<style>
.el-main {
  padding: 0 !important;
}
</style>

<style scoped>
.primary-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

.main-content {
  flex: 1;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 1rem;
  padding-top: calc(80px + 1rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

@media (max-width: 768px) {
  .main-content {
    padding: 0.5rem;
    padding-top: calc(80px + 0.5rem);
  }
}
</style>
