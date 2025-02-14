<template>
  <div class="team-info">
    <h2>Информация о команде</h2>
    <div class="info-content">
      <div class="form-group">
        <label>Название команды</label>
        <input type="text" v-model="teamName" class="form-input" />
      </div>
      <div class="form-group">
        <label>Описание</label>
        <textarea v-model="teamDescription" class="form-input" rows="4"></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const teamName = ref('')
const teamDescription = ref('')
</script>

<style scoped>
.team-info {
  max-width: 800px;
}

.info-content {
  margin-top: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--color-text);
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-text);
}

textarea.form-input {
  resize: vertical;
}
</style>