<template>
  <div class="users-container">
    <div class="filters-row">
      <UsersSearch
          v-model="searchQuery"
          @search="handleSearch"
      />
      <UsersFilter
          @filter="handleFilter"
      />
      <el-button type="primary" class="register-participant-btn" @click="registerDialogVisible = true">
        Зарегистрировать участника
      </el-button>
    </div>

    <div class="table-wrapper">
      <UsersTable
          :users="users"
          :loading="loading"
          @row-click="handleRowClick"
      />
    </div>

    <div class="pagination-container">
      <!-- Мобильная пагинация -->
      <div class="mobile-pagination" v-if="isMobile">
        <div class="pagination-info">
          Показано {{ ((currentPage - 1) * pageSize) + 1 }}-{{ Math.min(currentPage * pageSize, totalUsers) }} из {{ totalUsers }}
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
            <span class="total-pages">{{ Math.ceil(totalUsers / pageSize) }}</span>
          </div>
          <el-button
            :disabled="currentPage >= Math.ceil(totalUsers / pageSize)"
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
          :total="totalUsers"
          :page-sizes="[10, 20, 30, 50]"
          background
          layout="sizes, prev, pager, next, total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
    </div>

    <AdminUserDetailsDialog
        v-model:visible="userDetailsVisible"
        :user="selectedUser"
        :loading="loading"
        :documents="userDocuments"
        :documents-loading="documentsLoading"
        @roles-updated="loadUsers"
        @documents-updated="handleDocumentsUpdated"
    />

    <AdminRegisterParticipantDialog
        v-model:visible="registerDialogVisible"
        @registered="loadUsers"
    />
  </div>
</template>

<script setup>
import { onMounted, ref, computed, onBeforeUnmount, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { usersApi } from '@/api/users'
import UsersSearch from '../organizer/UsersSearch.vue'
import UsersTable from '../organizer/UsersTable.vue'
import AdminUserDetailsDialog from './AdminUserDetailsDialog.vue'
import AdminRegisterParticipantDialog from './AdminRegisterParticipantDialog.vue'
import UsersFilter from './UsersFilter.vue'

const STORAGE_KEY = 'admin_users_page'

const searchQuery = ref('')
const currentPage = ref(parseInt(localStorage.getItem(STORAGE_KEY) || '1', 10))
const pageSize = ref(10)
const totalUsers = ref(0)
const users = ref([])
const loading = ref(false)
const selectedRoles = ref([])
const selectedStatuses = ref([])

const documentsLoading = ref(false)
const userDocuments = ref([])
const selectedUser = ref(null)
const userDetailsVisible = ref(false)
const registerDialogVisible = ref(false)

const isMobile = ref(window.innerWidth <= 768)

const handleResize = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  loadUsers()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const loadUsers = async () => {
  try {
    loading.value = true
    const response = await usersApi.getAllUsers({
      limit: pageSize.value,
      offset: (currentPage.value - 1) * pageSize.value,
      search: searchQuery.value || undefined,
      roles: selectedRoles.value,
      statuses: selectedStatuses.value
    })
    users.value = response.users
    totalUsers.value = response.total
  } catch (error) {
    ElMessage.error('Ошибка при загрузке пользователей')
    console.error('Error loading users:', error)
  } finally {
    loading.value = false
  }
}

const handleFilter = ({ roles, statuses }) => {
  selectedRoles.value = roles
  selectedStatuses.value = statuses
  currentPage.value = 1
  localStorage.setItem(STORAGE_KEY, '1')
  loadUsers()
}

const viewUserDocuments = async (user) => {
  try {
    documentsLoading.value = true
    userDocuments.value = await usersApi.getUserDocuments(user.id)
  } catch (error) {
    ElMessage.error('Ошибка при загрузке документов')
  } finally {
    documentsLoading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  localStorage.setItem(STORAGE_KEY, '1')
  loadUsers()
}

const handleSizeChange = (val) => {
  pageSize.value = val
  loadUsers()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  localStorage.setItem(STORAGE_KEY, val.toString())
  loadUsers()
}

const handleRowClick = (row) => {
  selectedUser.value = row
  userDetailsVisible.value = true
  viewUserDocuments(row)
}

const handleDocumentsUpdated = () => {
  if (selectedUser.value) {
    viewUserDocuments(selectedUser.value)
  }
}

</script>

<style scoped>
.users-container {
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
  align-items: flex-start;
}

.register-participant-btn {
  flex-shrink: 0;
  white-space: nowrap;
}

.table-wrapper {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.pagination-container {
  margin-top: auto;
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

:deep(.el-pagination) {
  flex-wrap: wrap;
  justify-content: center;
}

  :deep(.el-pagination .el-pagination__sizes) {
  margin-right: 0;
  margin-bottom: 8px;
}

:deep(.el-pagination .el-pager) {
  margin: 0 8px;
}

@media (max-width: 768px) {
  .users-container {
    padding-bottom: 0;
    margin-bottom: 0;
  }

  .filters-row {
    flex-direction: column;
  }

  .table-wrapper {
    margin-bottom: 100px; /* Отступ для пагинации */
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
}
</style>