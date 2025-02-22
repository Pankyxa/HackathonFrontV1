<template>
  <div class="danger-zone">
    <h3>Опасная зона</h3>

    <div class="danger-card">
      <template v-if="isTeamLeader">
        <p class="warning-text">
          Удаление команды приведет к безвозвратному удалению всех данных команды. Это действие нельзя отменить.
        </p>
        <button
            class="delete-btn"
            @click="$emit('delete')"
        >
          Удалить команду
        </button>
      </template>

      <template v-else-if="isTeamMember || isTeamMentor">
        <p class="warning-text">
          При выходе из команды вы потеряете доступ к её материалам и не сможете вернуться без нового приглашения.
        </p>
        <button
            class="leave-btn"
            @click="$emit('leave')"
        >
          Покинуть команду
        </button>
      </template>
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
  },
  isTeamMentor: {
    type: Boolean,
    default: false
  }
})

defineEmits(['delete', 'leave'])
</script>

<style scoped>
.danger-zone {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #dcdfe6;
}

.danger-zone h3 {
  color: #ef4444;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  font-weight: 500;
}

.danger-card {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  padding: 1.5rem;
}

.warning-text {
  color: #ef4444;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  line-height: 1.5;
}

.delete-btn,
.leave-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  font-weight: 500;
}

.delete-btn:hover,
.leave-btn:hover {
  background: #dc2626;
}

.delete-btn:active,
.leave-btn:active {
  transform: translateY(1px);
}

@media (max-width: 768px) {
  .danger-zone {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
  }

  .danger-card {
    padding: 1rem;
  }

  .warning-text {
    font-size: 0.9rem;
  }

  .delete-btn,
  .leave-btn {
    width: 100%;
    padding: 0.75rem;
  }
}
</style>