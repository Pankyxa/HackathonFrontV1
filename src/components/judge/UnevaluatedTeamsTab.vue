<template>
  <div class="teams-tab">
    <div class="table-container">
      <el-table
          v-loading="loading"
          :data="teams"
          style="width: 100%"
          :height="tableHeight"
          @row-click="openEvaluationDialog"
      >
        <el-table-column prop="team_name" label="Название команды" min-width="200"/>
        <el-table-column prop="team_motto" label="Девиз" min-width="200"/>
        <el-table-column fixed="right" label="Действия" width="120">
          <template #default="{ row }">
            <el-button
                type="primary"
                link
                @click="openEvaluationDialog(row)"
            >
              Оценить
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <EvaluationDialog
        v-if="selectedTeam"
        v-model:visible="dialogVisible"
        :team="selectedTeam"
        @evaluation-submitted="handleEvaluationSubmitted"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import EvaluationDialog from './EvaluationDialog.vue'
import { ElMessage } from 'element-plus'
import { evaluationsApi } from '@/api/evaluations'

const loading = ref(false)
const teams = ref([])
const dialogVisible = ref(false)
const selectedTeam = ref(null)
const tableHeight = 'calc(100vh - 250px)'

const loadTeams = async () => {
  try {
    loading.value = true
    teams.value = await evaluationsApi.getUnevaluatedTeams()
  } catch (error) {
    console.error('Error loading teams:', error)
    ElMessage.error('Ошибка при загрузке списка команд')
  } finally {
    loading.value = false
  }
}

const openEvaluationDialog = (team) => {
  selectedTeam.value = team
  dialogVisible.value = true
}

const handleEvaluationSubmitted = async () => {
  dialogVisible.value = false
  await loadTeams()
}

onMounted(() => {
  loadTeams()
})
</script>

<style scoped>
.teams-tab {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.table-container {
  flex: 1;
  overflow: hidden;
}
</style>