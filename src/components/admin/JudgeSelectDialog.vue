<template>
  <el-dialog
      v-model="visible"
      title="Выбор члена жюри"
      width="500px"
  >
    <el-input
        v-model="searchQuery"
        placeholder="Поиск по ФИО"
        clearable
        @input="handleSearch"
    >
      <template #prefix>
        <el-icon>
          <Search />
        </el-icon>
      </template>
    </el-input>

    <el-table
        v-loading="loading"
        :data="judges"
        style="width: 100%; margin-top: 20px;"
        height="300px"
    >
      <el-table-column prop="full_name" label="ФИО"/>
      <el-table-column prop="email" label="Email"/>
      <el-table-column align="right">
        <template #default="scope">
          <el-button
              type="primary"
              size="small"
              @click="handleSelect(scope.row)"
              :loading="sendingNotification === scope.row.id"
          >
            Отправить
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { teamsApi } from '@/api/teams'

const props = defineProps({
  modelValue: Boolean,
})

const emit = defineEmits(['update:modelValue'])

const visible = ref(false)
const searchQuery = ref('')
const judges = ref([])
const loading = ref(false)
const sendingNotification = ref(null)

watch(() => props.modelValue, (newVal) => {
  visible.value = newVal
})

watch(visible, (newVal) => {
  emit('update:modelValue', newVal)
  if (newVal) {
    handleSearch()
  } else {
    searchQuery.value = ''
    judges.value = []
  }
})

const handleSearch = async () => {
  if (searchQuery.value.length < 2 && searchQuery.value.length !== 0) return

  try {
    loading.value = true
    const response = await teamsApi.searchJudges(searchQuery.value)
    judges.value = response
  } catch (error) {
    console.error('Error searching judges:', error)
    ElMessage.error('Ошибка при поиске членов жюри')
  } finally {
    loading.value = false
  }
}

const handleSelect = async (judge) => {
  try {
    sendingNotification.value = judge.id
    await teamsApi.sendSingleJudgeBriefingNotification(judge.id)
    ElMessage.success(`Уведомление отправлено ${judge.full_name}`)
    visible.value = false
  } catch (error) {
    console.error('Error sending notification:', error)
    ElMessage.error(`Ошибка при отправке уведомления: ${error.message || 'Неизвестная ошибка'}`)
  } finally {
    sendingNotification.value = null
  }
}
</script>