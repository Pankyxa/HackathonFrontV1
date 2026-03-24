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

      <el-button
        type="primary"
        :loading="exportLoading"
        @click="handleExportActiveTeams"
      >
        Выгрузить активные команды
      </el-button>
    </div>

    <!-- Десктопная таблица -->
    <div class="desktop-view">
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
    </div>

    <!-- Мобильный вид - карточки -->
    <div class="mobile-view" v-loading="loading">
      <div class="teams-cards">
        <div
          v-for="team in teams"
          :key="team.id"
          class="team-card"
          @click="handleRowClick(team)"
        >
          <div class="team-card-header">
            <el-avatar
                :size="50"
                :src="team.logo_file_id ? `${apiUrl}/teams/${team.id}/logo` : null"
                class="team-card-logo"
            >
              <el-icon>
                <UserFilled/>
              </el-icon>
            </el-avatar>
            <div class="team-card-title">
              <h3 class="team-card-name">{{ team.team_name }}</h3>
              <p class="team-card-motto">{{ team.team_motto }}</p>
            </div>
          </div>
          <div class="team-card-body">
            <div class="team-card-item">
              <span class="team-card-label">Статус:</span>
              <el-tag :type="getStatusType(team.status_details?.status)" size="small">
                {{ getStatusText(team.status_details?.status) }}
              </el-tag>
            </div>
            <div class="team-card-item">
              <span class="team-card-label">Участники:</span>
              <span class="team-card-value">
                <el-badge :value="team.members?.length || 0" :max="4" type="info">
                  <el-icon>
                    <User/>
                  </el-icon>
                </el-badge>
                {{ getMembersText(team.members) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="pagination-container">
      <!-- Мобильная пагинация -->
      <div class="mobile-pagination" v-if="isMobile">
        <div class="pagination-info">
          Показано {{ ((currentPage - 1) * pageSize) + 1 }}-{{ Math.min(currentPage * pageSize, totalTeams) }} из {{ totalTeams }}
        </div>
        <div class="pagination-controls">
          <el-button
            :disabled="currentPage === 1"
            :icon="ArrowLeft"
            circle
            size="small"
            @click="handleCurrentChange(currentPage - 1)"
          />
          <div class="page-indicator">
            <span class="current-page">{{ currentPage }}</span>
            <span class="separator">/</span>
            <span class="total-pages">{{ Math.ceil(totalTeams / pageSize) }}</span>
          </div>
          <el-button
            :disabled="currentPage >= Math.ceil(totalTeams / pageSize)"
            :icon="ArrowRight"
            circle
            size="small"
            @click="handleCurrentChange(currentPage + 1)"
          />
        </div>
        <el-select
          v-model="pageSize"
          size="small"
          class="page-size-select"
          @change="handleSizeChange"
        >
          <el-option label="10" :value="10" />
          <el-option label="20" :value="20" />
          <el-option label="30" :value="30" />
          <el-option label="50" :value="50" />
        </el-select>
      </div>
      
      <!-- Десктопная пагинация -->
      <el-pagination
          v-else
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
        :width="isMobile ? '100%' : '70%'"
        :fullscreen="isMobile"
        destroy-on-close
        class="team-details-dialog"
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
import {ref, computed, onMounted, onBeforeUnmount, onUnmounted} from 'vue'
import {ElMessage} from 'element-plus'
import {Search, UserFilled, User, Warning, ArrowLeft, ArrowRight} from '@element-plus/icons-vue'
import {teamsApi} from '@/api/teams'
import TeamInfo from '../team/TeamInfo.vue'
import TeamsFilter from './TeamsFilter.vue'

const apiUrl = import.meta.env.VITE_API_URL
const STORAGE_KEY = 'admin_teams_page'

const searchQuery = ref('')
const searchDebounce = ref(null)
const currentPage = ref(parseInt(localStorage.getItem(STORAGE_KEY) || '1', 10))
const pageSize = ref(10)
const totalTeams = ref(0)
const teams = ref([])
const loading = ref(false)
const selectedStatus = ref('')

const selectedTeam = ref(null)
const teamDetailsVisible = ref(false)
const exportLoading = ref(false)

const isMobile = ref(window.innerWidth <= 768)

const handleResize = () => {
  isMobile.value = window.innerWidth <= 768
}

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
  localStorage.setItem(STORAGE_KEY, '1')

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
  localStorage.setItem(STORAGE_KEY, '1')
  loadTeams()
}

const handleSizeChange = (val) => {
  pageSize.value = val
  loadTeams()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  localStorage.setItem(STORAGE_KEY, val.toString())
  loadTeams()
}

const handleRowClick = (row) => {
  selectedTeam.value = row
  teamDetailsVisible.value = true
}

const handleTeamUpdate = () => {
  loadTeams()
}

const getFileNameFromDisposition = (contentDisposition) => {
  if (!contentDisposition) {
    return 'active_teams.xlsx'
  }

  const utfMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i)
  if (utfMatch?.[1]) {
    return decodeURIComponent(utfMatch[1])
  }

  const match = contentDisposition.match(/filename="?([^";]+)"?/i)
  return match?.[1] || 'active_teams.xlsx'
}

const handleExportActiveTeams = async () => {
  try {
    exportLoading.value = true
    const { blob, contentDisposition } = await teamsApi.exportActiveTeams()
    const fileName = getFileNameFromDisposition(contentDisposition)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    ElMessage.success('Выгрузка активных команд успешно сформирована')
  } catch (error) {
    ElMessage.error(error?.detail || error?.message || 'Ошибка при выгрузке активных команд')
  } finally {
    exportLoading.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  loadTeams()
})

onBeforeUnmount(() => {
  if (searchDebounce.value) {
    clearTimeout(searchDebounce.value)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.teams-container {
  margin-top: 20px;
  flex: 1;
  display: flex;
  min-height: 0;
  flex-direction: column;
  width: 100%;
  overflow: visible;
  position: relative;
}

.filters-row {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  flex-shrink: 0;
}

.desktop-view {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.desktop-view :deep(.el-table) {
  flex: 1;
  min-height: 0;
  overflow: auto;
}

.desktop-view :deep(.el-table__body-wrapper) {
  max-height: calc(100vh - 400px);
  overflow-y: auto;
}

.mobile-view {
  display: none;
  flex: 1;
  min-height: 0;
  overflow: auto;
}

.pagination-container {
  margin-top: 16px;
  padding: 12px 0;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
  overflow: visible;
  background: white;
  border-top: 1px solid #e4e7ed;
  position: relative;
  z-index: 10;
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

:deep(.el-pagination) {
  flex-wrap: wrap;
  justify-content: center;
}

:deep(.el-pagination .el-pagination__sizes) {
  margin-right: 0;
  margin-bottom: 8px;
}

/* Мобильный вид - карточки */
.teams-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.team-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e4e7ed;
  cursor: pointer;
  transition: all 0.3s ease;
}

.team-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.team-card-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e4e7ed;
}

.team-card-logo {
  flex-shrink: 0;
}

.team-card-title {
  flex: 1;
  min-width: 0;
}

.team-card-name {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  word-break: break-word;
}

.team-card-motto {
  margin: 0;
  font-size: 14px;
  color: #606266;
  word-break: break-word;
}

.team-card-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.team-card-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.team-card-label {
  font-size: 12px;
  color: #909399;
  font-weight: 500;
}

.team-card-value {
  font-size: 14px;
  color: #606266;
  display: flex;
  align-items: center;
  gap: 6px;
}

@media (max-width: 768px) {
  .teams-container {
    padding-bottom: 0;
    margin-bottom: 0;
  }

  .filters-row {
    flex-direction: column;
  }

  .desktop-view {
    display: none !important;
  }

  .mobile-view {
    display: block;
    margin-bottom: 80px; /* Отступ для пагинации */
  }

  .pagination-container {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 16px;
    margin: 0;
    background: white;
    border-top: 1px solid #e4e7ed;
    box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.08);
    z-index: 100;
  }

  .mobile-pagination {
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
  }

  .pagination-info {
    font-size: 13px;
    color: #909399;
    text-align: center;
  }

  .pagination-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    width: 100%;
  }

  .page-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: #f5f7fa;
    border-radius: 20px;
    min-width: 80px;
    justify-content: center;
  }

  .page-indicator .current-page {
    font-size: 16px;
    font-weight: 600;
    color: #409EFF;
  }

  .page-indicator .separator {
    font-size: 14px;
    color: #909399;
  }

  .page-indicator .total-pages {
    font-size: 14px;
    color: #606266;
  }

  .page-size-select {
    width: 100%;
    max-width: 200px;
  }

  :deep(.page-size-select .el-input__inner) {
    text-align: center;
  }

  :deep(.el-pagination) {
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  :deep(.el-pagination .el-pagination__sizes),
  :deep(.el-pagination .el-pagination__total),
  :deep(.el-pagination .btn-prev),
  :deep(.el-pagination .el-pager),
  :deep(.el-pagination .btn-next) {
    margin: 0;
  }

  :deep(.team-details-dialog .el-dialog__body) {
    padding: 16px;
    max-height: calc(100vh - 66px);
    overflow-y: auto;
  }

  :deep(.team-details-dialog .el-dialog__header) {
    padding: 16px;
  }

  :deep(.team-details-dialog .el-dialog__title) {
    font-size: 18px;
  }
}

@media (min-width: 769px) {
  .mobile-view {
    display: none !important;
  }

  .desktop-view {
    display: flex !important;
  }
}
</style>
