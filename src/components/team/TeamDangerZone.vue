<template>
  <div class="danger-zone">
    <h3>Опасная зона</h3>

    <div class="danger-card">
      <p class="warning-text">
        Удаление команды приведет к безвозвратному удалению всех данных команды. Это действие нельзя отменить.
      </p>
      <button
        v-if="isTeamLeader"
        class="delete-btn"
        @click="$emit('delete')"
      >
        Удалить команду
      </button>

      <button
        v-else-if="isTeamMember"
        class="leave-btn"
        @click="$emit('leave')"
      >
          Покинуть команду
        </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isTeamLeader: {
    type: Boolean,
    default: false
  },
  isTeamMember: {
    type: Boolean,
    default: false
  }
})

defineEmits(['delete', 'leave'])
</script>

<style scoped>
.danger-zone {
  margin-top: 2rem;
}

.danger-zone h3 {
  color: #ef4444;
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.danger-card {
  background: #fef2f2;
  border-radius: 12px;
  padding: 1.5rem;
}

.warning-text {
  color: #ef4444;
  margin-bottom: 1rem;
}

.delete-btn, .leave-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.delete-btn:hover, .leave-btn:hover {
  opacity: 0.9;
}
</style>