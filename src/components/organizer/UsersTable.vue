<template>
  <el-table
    v-loading="loading"
    :data="users"
    style="width: 100%"
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
</template>

<script setup>
defineProps({
  users: {
    type: Array,
    required: true
  },
  loading: Boolean
})

defineEmits(['row-click'])

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
:deep(.el-table .cell) {
  white-space: nowrap;
}

:deep(.el-table tbody tr) {
  cursor: pointer;
}

:deep(.el-table tbody tr:hover) {
  background-color: #f5f7fa;
}
</style>