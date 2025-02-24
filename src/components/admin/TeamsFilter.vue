<template>
  <el-select
      v-model="selectedStatus"
      placeholder="Фильтр по статусу"
      clearable
      @change="handleFilterChange"
  >
    <el-option
        v-for="status in statuses"
        :key="status.value"
        :label="status.label"
        :value="status.value"
    />
  </el-select>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['filter'])

const selectedStatus = ref('')

const statuses = [
  { value: 'active', label: 'Активные команды' },
  { value: 'incomplete', label: 'Неполный состав' },
  { value: 'pending', label: 'Ожидают подтверждения' },
  { value: 'needs_update', label: 'Требуют обновления' }
]

const handleFilterChange = () => {
  emit('filter', selectedStatus.value)
}
</script>