<template>
  <!-- Десктопная таблица -->
  <div class="desktop-view">
    <el-table
      v-loading="loading"
      :data="users"
      style="width: 100%"
      :max-height="tableMaxHeight"
      @row-click="$emit('row-click', $event)"
    >
      <el-table-column prop="full_name" label="ФИО"/>
      <el-table-column prop="email" label="Email"/>
      <el-table-column label="Роли">
        <template #default="scope">
          {{ formatRoles(scope.row.roles) }}
        </template>
      </el-table-column>
      <el-table-column prop="registered_at" label="Дата регистрации">
        <template #default="scope">
          {{ formatDate(scope.row.registered_at) }}
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!-- Мобильный вид - карточки -->
  <div class="mobile-view" v-loading="loading">
    <div class="users-cards">
      <div
        v-for="user in users"
        :key="user.id"
        class="user-card"
        @click="$emit('row-click', user)"
      >
        <div class="user-card-header">
          <h3 class="user-card-name">{{ user.full_name }}</h3>
        </div>
        <div class="user-card-body">
          <div class="user-card-item">
            <span class="user-card-label">Email:</span>
            <span class="user-card-value">{{ user.email }}</span>
          </div>
          <div class="user-card-item">
            <span class="user-card-label">Роли:</span>
            <span class="user-card-value">{{ formatRoles(user.roles) }}</span>
          </div>
          <div class="user-card-item">
            <span class="user-card-label">Дата регистрации:</span>
            <span class="user-card-value">{{ formatDate(user.registered_at) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

defineProps({
  users: {
    type: Array,
    required: true
  },
  loading: Boolean
})

defineEmits(['row-click'])

const isMobile = computed(() => window.innerWidth <= 768)

const tableMaxHeight = computed(() => {
  if (isMobile.value) {
    return undefined
  }
  return 'calc(100vh - 450px)'
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
.desktop-view {
  display: block;
  flex: 1;
  min-height: 0;
  overflow: auto;
}

.mobile-view {
  display: none;
  flex: 1;
  min-height: 0;
  overflow: auto;
}

:deep(.el-table .cell) {
  white-space: nowrap;
}

:deep(.el-table tbody tr) {
  cursor: pointer;
}

:deep(.el-table tbody tr:hover) {
  background-color: #f5f7fa;
}

/* Мобильный вид - карточки */
.users-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.user-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e4e7ed;
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.user-card-header {
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e4e7ed;
}

.user-card-name {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.user-card-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.user-card-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-card-label {
  font-size: 12px;
  color: #909399;
  font-weight: 500;
}

.user-card-value {
  font-size: 14px;
  color: #606266;
  word-break: break-word;
}

@media (max-width: 768px) {
  .desktop-view {
    display: none !important;
  }

  .mobile-view {
    display: block;
  }
}

@media (min-width: 769px) {
  .mobile-view {
    display: none !important;
  }

  .desktop-view {
    display: block;
  }
}
</style>