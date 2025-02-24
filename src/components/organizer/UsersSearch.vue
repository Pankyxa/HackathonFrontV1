<template>
  <div class="search-container">
    <el-input
        :model-value="modelValue"
        placeholder="Поиск по ФИО или email"
        clearable
        @input="handleInput"
    >
      <template #prefix>
        <el-icon>
          <Search/>
        </el-icon>
      </template>
    </el-input>
  </div>
</template>

<script setup>
import {Search} from '@element-plus/icons-vue'

defineProps({
  modelValue: String
})

const emit = defineEmits(['update:modelValue', 'search'])

const handleInput = (value) => {
  emit('update:modelValue', value)
  if (value.length !== 1) {
    emit('search')
  }
}
</script>

<style scoped>
.search-container {
  margin-bottom: 20px;
}
</style>