<template>
  <div class="user-info-section">
    <h3>Информация о пользователе</h3>
    <div class="info-grid" v-if="user">
      <div class="info-item">
        <label>ФИО:</label>
        <span>{{ user.full_name }}</span>
      </div>
      <div class="info-item">
        <label>Email:</label>
        <span>{{ user.email }}</span>
      </div>
      <div class="info-item">
        <label>Роли:</label>
        <span>{{ formatRoles(user.roles) }}</span>
      </div>
      <div class="info-item">
        <label>Статус:</label>
        <span>{{ user.current_status.description }}</span>
      </div>
        <div class="info-item">
        <label>Дата регистрации:</label>
        <span>{{ formatDate(user.registered_at) }}</span>
        </div>

      <template v-if="user.participant_info">
        <div class="info-item">
          <label>Номер телефона:</label>
          <span>{{ user.participant_info.number }}</span>
        </div>
        <div class="info-item">
          <label>ВУЗ:</label>
          <span>{{ user.participant_info.vuz }}</span>
        </div>
        <div class="info-item">
          <label>Направление:</label>
          <span>{{ user.participant_info.vuz_direction }}</span>
        </div>
        <div class="info-item">
          <label>Специальность:</label>
          <span>{{ user.participant_info.code_speciality }}</span>
        </div>
        <div class="info-item">
          <label>Курс:</label>
          <span>{{ user.participant_info.course }}</span>
        </div>
      </template>

      <template v-if="user.mentor_info">
        <div class="info-item">
          <label>Номер телефона:</label>
          <span>{{ user.mentor_info.number }}</span>
    </div>
        <div class="info-item">
          <label>Место работы:</label>
          <span>{{ user.mentor_info.job }}</span>
  </div>
        <div class="info-item">
          <label>Должность:</label>
          <span>{{ user.mentor_info.job_title }}</span>
        </div>
</template>
    </div>
  </div>
</template>

<script setup>
defineProps({
  user: Object
})

const formatDate = (date) => {
  return new Date(date).toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatRoles = (roles) => {
  if (!roles || !roles.length) return '—'
  return roles.map(role => role.description).join(', ')
}
</script>

<style scoped>
.user-info-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item label {
  font-weight: 500;
  color: #606266;
  font-size: 14px;
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>