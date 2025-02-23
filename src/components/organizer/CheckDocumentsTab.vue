<template>
  <div class="users-container">
    <UsersSearch 
      v-model="searchQuery"
      @search="handleSearch"
    />
    
    <UsersTable
      :users="pendingUsers"
      :loading="loading"
      @row-click="handleRowClick"
    />

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="totalUsers"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <UserDetailsDialog
      v-model:visible="userDetailsVisible"
      :user="selectedUser"
      :loading="loading"
      :documents="userDocuments"
      :documents-loading="documentsLoading"
      @status-change="handleStatusChange"
    />

    <StatusChangeDialog
      v-model:visible="statusDialogVisible"
      v-model:comment="statusComment"
      :status="pendingStatusChange.status"
      @confirm="confirmStatusChange"
    />
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {ElMessage} from 'element-plus'
import {usersApi} from '@/api/users'
import UsersSearch from './UsersSearch.vue'
import UsersTable from './UsersTable.vue'
import UserDetailsDialog from './UserDetailsDialog.vue'
import StatusChangeDialog from './StatusChangeDialog.vue'

const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const totalUsers = ref(0)
const pendingUsers = ref([])
const loading = ref(false)

const documentsLoading = ref(false)
const userDocuments = ref([])
const selectedUser = ref(null)

const statusDialogVisible = ref(false)
const statusComment = ref('')
const pendingStatusChange = ref({ user: null, status: null })
const userDetailsVisible = ref(false)

const loadPendingUsers = async () => {
  try {
    loading.value = true
    const response = await usersApi.getPendingUsers({
      limit: pageSize.value,
      offset: (currentPage.value - 1) * pageSize.value,
      search: searchQuery.value || undefined
    })
    pendingUsers.value = response.users
    totalUsers.value = response.total
  } catch (error) {
    ElMessage.error('Ошибка при загрузке пользователей')
    console.error('Error loading pending users:', error)
  } finally {
    loading.value = false
  }
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

const handleStatusChange = (user, status) => {
  pendingStatusChange.value = { user, status }
  statusComment.value = ''
  statusDialogVisible.value = true
}

const confirmStatusChange = async () => {
  try {
    const { user, status } = pendingStatusChange.value
    await usersApi.updateUserStatus(user.id, status, statusComment.value)
    ElMessage.success('Статус пользователя успешно обновлен')
    statusDialogVisible.value = false
    await loadPendingUsers()
  } catch (error) {
    ElMessage.error('Ошибка при обновлении статуса')
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadPendingUsers()
}

const handleSizeChange = (val) => {
  pageSize.value = val
  loadPendingUsers()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  loadPendingUsers()
}

const handleRowClick = (row) => {
  selectedUser.value = row
  userDetailsVisible.value = true
  viewUserDocuments(row)
}

onMounted(() => {
  loadPendingUsers()
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

.pagination-container {
  margin-top: auto;
  padding-top: 20px;
  display: flex;
  justify-content: center;
}
</style>