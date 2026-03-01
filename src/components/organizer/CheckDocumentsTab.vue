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
        layout="sizes, prev, pager, next, total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- Модалка для изменения статуса -->
    <StatusChangeDialog
      v-model:visible="statusDialogVisible"
      v-model:comment="statusComment"
      :status="pendingStatus"
      @confirm="confirmStatusChange"
    />
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import {ElMessage} from 'element-plus'
import {usersApi} from '@/api/users'
import UsersSearch from './UsersSearch.vue'
import UsersTable from './UsersTable.vue'
import StatusChangeDialog from './StatusChangeDialog.vue'

const router = useRouter()

const STORAGE_KEY = 'organizer_pending_users_page'

const searchQuery = ref('')
const currentPage = ref(parseInt(localStorage.getItem(STORAGE_KEY) || '1', 10))
const pageSize = ref(10)
const totalUsers = ref(0)
const pendingUsers = ref([])
const loading = ref(false)

// Модалка изменения статуса
const statusDialogVisible = ref(false)
const statusComment = ref('')
const pendingStatus = ref(null)
const pendingUser = ref(null)

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

const handleRowClick = (row) => {
  // Переход на отдельную страницу проверки документов
  router.push({
    path: `/organizer/users/${row.id}/documents`,
    query: {
      userData: JSON.stringify(row)
    }
  })
}

// Эта функция больше не используется, так как статус меняется на отдельной странице
// Оставляем для совместимости, если где-то еще используется
const handleStatusChange = (user, status) => {
  pendingUser.value = user
  pendingStatus.value = status
  statusComment.value = ''
  statusDialogVisible.value = true
}

const confirmStatusChange = async () => {
  if (!pendingUser.value) return

  try {
    await usersApi.updateUserStatus(pendingUser.value.id, pendingStatus.value, statusComment.value)
    ElMessage.success('Статус пользователя успешно обновлен')
    statusDialogVisible.value = false
    // Обновляем список пользователей
    await loadPendingUsers()
  } catch (error) {
    console.error('Error updating user status:', error)
    const errorMessage = error?.detail || error?.message || 'Ошибка при обновлении статуса'
    ElMessage.error(errorMessage)
  }
}

const handleSearch = () => {
  currentPage.value = 1
  localStorage.setItem(STORAGE_KEY, '1')
  loadPendingUsers()
}

const handleSizeChange = (val) => {
  pageSize.value = val
  loadPendingUsers()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  localStorage.setItem(STORAGE_KEY, val.toString())
  loadPendingUsers()
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