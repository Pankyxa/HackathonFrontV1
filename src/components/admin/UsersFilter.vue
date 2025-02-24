<template>
  <div class="filters-container">
    <el-select
        v-model="selectedRoles"
        multiple
        collapse-tags
        collapse-tags-tooltip
        placeholder="Фильтр по ролям"
        @change="handleFiltersChange"
    >
      <el-option
          v-for="role in roles"
          :key="role.value"
          :label="role.label"
          :value="role.value"
      />
    </el-select>

    <el-select
        v-model="selectedStatuses"
        multiple
        collapse-tags
        collapse-tags-tooltip
        placeholder="Фильтр по статусам"
        @change="handleFiltersChange"
    >
      <el-option
          v-for="status in statuses"
          :key="status.value"
          :label="status.label"
          :value="status.value"
      />
    </el-select>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const roles = [
  { label: 'Участник', value: 'participant' },
  { label: 'Наставник', value: 'mentor' },
  { label: 'Жюри', value: 'judge' },
  { label: 'Организатор', value: 'organizer' },
  { label: 'Администратор', value: 'admin' },
  { label: 'Нет роли', value: '-' }
]

const statuses = [
  { label: 'В ожидании', value: 'pending' },
  { label: 'Подтвержден', value: 'approved' },
  { label: 'Требует обновления', value: 'need_update' }
]

const selectedRoles = ref([])
const selectedStatuses = ref([])

const emit = defineEmits(['filter'])

const handleFiltersChange = () => {
  emit('filter', {
    roles: selectedRoles.value,
    statuses: selectedStatuses.value
  })
}
</script>

<style scoped>
.filters-container {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.el-select {
  width: 240px;
}

@media (max-width: 768px) {
  .filters-container {
    flex-direction: column;
  }

  .el-select {
    width: 100%;
  }
}
</style>