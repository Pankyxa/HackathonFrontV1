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
    </div>

    <UsersTable
        :users="users"
        :loading="loading"
        @row-click="handleRowClick"
    />

    <div class="pagination-container">
      <el-pagination
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
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { usersApi } from '@/api/users'
import UsersSearch from '../organizer/UsersSearch.vue'
import UsersTable from '../organizer/UsersTable.vue'
import AdminUserDetailsDialog from './AdminUserDetailsDialog.vue'
import UsersFilter from './UsersFilter.vue'

const searchQuery = ref('')
const currentPage = ref(1)
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
  loadUsers()
}

const handleSizeChange = (val) => {
  pageSize.value = val
  loadUsers()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  loadUsers()
}

const handleRowClick = (row) => {
  selectedUser.value = row
  userDetailsVisible.value = true
  viewUserDocuments(row)
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.users-container {
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

@media (max-width: 768px) {
  .filters-row {
    flex-direction: column;
  }
}
</style>