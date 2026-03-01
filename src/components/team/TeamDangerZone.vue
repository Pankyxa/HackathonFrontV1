<template>
  <div class="danger-zone">
    <div class="danger-card">
      <template v-if="isTeamLeader">
        <h3 class="danger-title">Удалить команду</h3>
        <p class="danger-description">
          Удаление команды приведет к безвозвратному удалению всех данных. Это действие нельзя отменить.
        </p>
        <div class="danger-actions">
          <button
              class="danger-button"
              @click="$emit('delete')"
          >
            Удалить команду
          </button>
        </div>
      </template>

      <template v-else-if="isTeamMember || isTeamMentor">
        <h3 class="danger-title">Покинуть команду</h3>
        <p class="danger-description">
          При выходе из команды вы потеряете доступ к её материалам и не сможете вернуться без нового приглашения.
        </p>
        <div class="danger-actions">
          <button
              class="danger-button"
              @click="$emit('leave')"
          >
            Покинуть команду
          </button>
        </div>
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
  margin-top: 32px; /* mt-8 */
}

.danger-card {
  background: white; /* bg-white */
  border: 1px solid #fecaca; /* border border-red-200 */
  border-radius: 12px; /* rounded-xl */
  padding: 24px; /* p-6 */
  margin-top: 32px; /* mt-8 */
}

.danger-title {
  font-size: 1.125rem; /* text-lg */
  font-weight: 600; /* font-semibold */
  color: #b91c1c; /* text-red-700 */
  margin: 0 0 4px 0; /* mb-1 */
}

.danger-description {
  font-size: 0.875rem; /* text-sm */
  color: #475569; /* text-slate-600 */
  margin: 4px 0 16px 0; /* mt-1 mb-4 */
  line-height: 1.5;
}

.danger-actions {
  display: flex;
  justify-content: flex-end; /* Align to right */
  gap: 12px;
}

.danger-button {
  background: white; /* bg-white */
  border: 1px solid #fecaca; /* border border-red-200 */
  color: #dc2626; /* text-red-600 */
  padding: 8px 16px; /* px-4 py-2 */
  border-radius: 8px; /* rounded-lg */
  font-size: 0.875rem; /* text-sm */
  font-weight: 500; /* font-medium */
  cursor: pointer;
  transition: all 0.2s ease;
}

.danger-button:hover {
  background: #fef2f2; /* hover:bg-red-50 */
  border-color: #fca5a5; /* hover:border-red-300 */
}

.danger-button:active {
  transform: translateY(1px);
}

@media (max-width: 768px) {
  .danger-zone {
    margin-top: 24px;
  }

  .danger-card {
    padding: 20px;
  }

  .danger-title {
    font-size: 1rem;
  }

  .danger-description {
    font-size: 0.8125rem;
  }

  .danger-actions {
    justify-content: stretch;
  }

  .danger-button {
    width: 100%;
    padding: 10px 16px;
  }
}
</style>