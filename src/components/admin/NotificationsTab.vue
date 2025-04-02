<template>
  <div class="notifications-tab">
    <el-card class="notification-card">
      <template #header>
        <div class="card-header">
          <h3>Рассылка уведомлений</h3>
        </div>
      </template>
      
      <div class="notification-actions">
        <el-button 
          type="primary" 
          :loading="isLoading"
          @click="handleSendConsultationNotification"
        >
          Разослать уведомления об консультации о проведении хакатона
        </el-button>
      </div>

      <div v-if="notificationStatus" class="notification-status" :class="statusClass">
        {{ notificationStatus }}
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { teamsApi } from '@/api/teams'

const isLoading = ref(false)
const notificationStatus = ref('')
const statusClass = ref('')

const handleSendConsultationNotification = async () => {
  try {
    isLoading.value = true
    notificationStatus.value = 'Отправка уведомлений...'
    statusClass.value = 'status-info'

    const response = await teamsApi.sendConsultationNotification()
    
    notificationStatus.value = 'Рассылка уведомлений успешно запущена'
    statusClass.value = 'status-success'
    ElMessage.success('Рассылка уведомлений успешно запущена')
  } catch (error) {
    console.error('Error sending notifications:', error)
    notificationStatus.value = `Ошибка при отправке уведомлений: ${error.message || 'Неизвестная ошибка'}`
    statusClass.value = 'status-error'
    ElMessage.error('Ошибка при отправке уведомлений')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.notifications-tab {
  height: 100%;
  padding: 20px;
}

.notification-card {
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
}

.notification-actions {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.notification-status {
  text-align: center;
  padding: 10px;
  margin-top: 20px;
  border-radius: 4px;
}

.status-info {
  background-color: #e6f1fc;
  color: #409eff;
}

.status-success {
  background-color: #f0f9eb;
  color: #67c23a;
}

.status-error {
  background-color: #fef0f0;
  color: #f56c6c;
}
</style>