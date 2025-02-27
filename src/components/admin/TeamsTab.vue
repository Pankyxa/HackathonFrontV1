<template>
  <div class="teams-container">
    <div class="filters-row">
      <el-input
          v-model="searchQuery"
          placeholder="Поиск по названию команды (минимум 2 символа)"
          clearable
          :suffix-icon="searchQuery && searchQuery.length < 2 ? 'warning' : ''"
          @input="handleSearch"
      >
        <template #prefix>
          <el-icon>
            <Search/>
          </el-icon>
        </template>
        <template #suffix>
          <el-tooltip
              v-if="searchQuery && searchQuery.length < 2"
              content="Минимум 2 символа для поиска"
              placement="top"
          >
            <el-icon class="warning-icon">
              <Warning/>
            </el-icon>
          </el-tooltip>
        </template>
      </el-input>

      <TeamsFilter @filter="handleStatusFilter"/>
    </div>

    <el-table
        v-loading="loading"
        :data="teams"
        style="width: 100%"
        @row-click="handleRowClick"
    >
      <el-table-column label="Логотип" width="80">
        <template #default="{ row }">
          <el-avatar
              :size="40"
              :src="row.logo_file_id ? `${apiUrl}/teams/${row.id}/logo` : null"
          >
            <el-icon>
              <UserFilled/>
            </el-icon>
          </el-avatar>
        </template>
      </el-table-column>

      <el-table-column prop="team_name" label="Название" sortable/>

      <el-table-column prop="team_motto" label="Девиз" show-overflow-tooltip/>

      <el-table-column label="Статус" width="180">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status_details?.status)">
            {{ getStatusText(row.status_details?.status) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="Участники" width="200">
        <template #default="{ row }">
          <el-tooltip
              v-if="row.members"
              :content="getMembersTooltip(row.members)"
              placement="top"
          >
            <div class="members-count">
              <el-badge :value="row.members.length" :max="4" type="info">
                <el-icon>
                  <User/>
                </el-icon>
              </el-badge>
              {{ getMembersText(row.members) }}
            </div>
          </el-tooltip>
          <div v-else>
            Загрузка...
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="totalTeams"
          :page-sizes="[10, 20, 30, 50]"
          background
          layout="sizes, prev, pager, next, total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog
        v-model="teamDetailsVisible"
        title="Информация о команде"
        width="70%"
        destroy-on-close
    >
      <TeamInfo
          v-if="selectedTeam"
          :team-id="selectedTeam.id"
          view-mode="admin"
          @update:team-info="handleTeamUpdate"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import {ref, onMounted, onBeforeUnmount} from 'vue'
import {ElMessage} from 'element-plus'
import {Search, UserFilled, User, Warning} from '@element-plus/icons-vue'
import {teamsApi} from '@/api/teams'
import TeamInfo from '../team/TeamInfo.vue'
import TeamsFilter from './TeamsFilter.vue'

const apiUrl = import.meta.env.VITE_API_URL

const searchQuery = ref('')
const searchDebounce = ref(null)
const currentPage = ref(1)
const pageSize = ref(10)
const totalTeams = ref(0)
const teams = ref([])
const loading = ref(false)
const selectedStatus = ref('')

const selectedTeam = ref(null)
const teamDetailsVisible = ref(false)

const loadTeamMembers = async (teamId) => {
  try {
    const membersData = await teamsApi.getTeamMembers(teamId)
    return membersData.members
  } catch (error) {
    console.error('Error loading team members:', error)
    return []
  }
}

const loadTeams = async () => {
  try {
    loading.value = true
    const response = await teamsApi.getAdminTeams({
      limit: pageSize.value,
      offset: (currentPage.value - 1) * pageSize.value,
      search: searchQuery.value.length >= 2 ? searchQuery.value : undefined,
      status: selectedStatus.value || undefined
    })

    const teamsWithMembers = await Promise.all(
        response.teams.map(async (team) => {
          const members = await loadTeamMembers(team.id)
          return {...team, members}
        })
    )

    teams.value = teamsWithMembers
    totalTeams.value = response.total
  } catch (error) {
    ElMessage.error('Ошибка при загрузке команд')
    console.error('Error loading teams:', error)
  } finally {
    loading.value = false
  }
}

const getStatusType = (status) => {
  switch (status) {
    case 'active':
      return 'success'
    case 'incomplete':
      return 'warning'
    case 'pending':
      return 'info'
    case 'needs_update':
      return 'warning'
    default:
      return 'info'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'incomplete':
      return 'Неполный состав'
    case 'pending':
      return 'Ожидает подтверждения'
    case 'needs_update':
      return 'Требует обновления'
    case 'active':
      return 'Активна'
    default:
      return 'Неизвестно'
  }
}

const getMembersTooltip = (members) => {
  if (!members) return ''
  return members
      .map(member => `${member.user.full_name} (${member.role === 'MENTOR' ? 'Наставник' : 'Участник'})`)
      .join('\n')
}

const getMembersText = (members) => {
  if (!members) return 'Нет участников'
  const mentorCount = members.filter(m => m.role === 'MENTOR').length
  const memberCount = members.length - mentorCount
  return `${memberCount} уч. ${mentorCount ? `+ ${mentorCount} наст.` : ''}`
}

const handleSearch = () => {
  if (searchDebounce.value) {
    clearTimeout(searchDebounce.value)
  }

  currentPage.value = 1

  if (!searchQuery.value || searchQuery.value.length < 2) {
    if (!searchQuery.value) {
      loadTeams()
    }
    return
  }

  searchDebounce.value = setTimeout(() => {
    loadTeams()
  }, 300)
}

const handleStatusFilter = (status) => {
  selectedStatus.value = status
  currentPage.value = 1
  loadTeams()
}

const handleSizeChange = (val) => {
  pageSize.value = val
  loadTeams()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  loadTeams()
}

const handleRowClick = (row) => {
  selectedTeam.value = row
  teamDetailsVisible.value = true
}

const handleTeamUpdate = () => {
  loadTeams()
}

onMounted(() => {
  loadTeams()
})

onBeforeUnmount(() => {
  if (searchDebounce.value) {
    clearTimeout(searchDebounce.value)
  }
})
</script>

<style scoped>
.teams-container {
  margin-top: 20px;
  flex: 1;
  display: flex;
  height: calc(100% - 42px);
  flex-direction: column;
  width: 100%;
}

.filters-row {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: auto;
  padding-top: 20px;
  display: flex;
  justify-content: center;
}

.members-count {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: help;
}

:deep(.el-table__row) {
  cursor: pointer;
}

.warning-icon {
  color: var(--el-color-warning);
}

:deep(.el-input__suffix) {
  display: flex;
  align-items: center;
}

@media (max-width: 768px) {
  .filters-row {
    flex-direction: column;
  }
}
</style>