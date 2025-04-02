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
            :loading="isConsultationLoading"
            @click="handleSendConsultationNotification"
            class="notification-button"
        >
          Разослать уведомления о консультации
        </el-button>

        <div class="briefing-buttons">
        <el-button
            type="primary"
            :loading="isBriefingLoading"
            @click="handleSendBriefingNotification"
            class="notification-button"
        >
          Разослать уведомления о брифинге для жюри
        </el-button>

          <el-button
              type="primary"
              @click="showJudgeSelect"
              class="notification-button"
          >
            Отправить уведомление о брифинге выбранному члену жюри
          </el-button>
      </div>
  </div>

      <div v-if="notificationStatus" class="notification-status" :class="statusClass">
        {{ notificationStatus }}
      </div>
    </el-card>

    <JudgeSelectDialog v-model="judgeSelectVisible"/>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { teamsApi } from '@/api/teams'
import JudgeSelectDialog from './JudgeSelectDialog.vue'

const isConsultationLoading = ref(false)
const isBriefingLoading = ref(false)
const notificationStatus = ref('')
const statusClass = ref('')
const judgeSelectVisible = ref(false)

const handleSendConsultationNotification = async () => {
  try {
    isConsultationLoading.value = true
    notificationStatus.value = 'Отправка уведомлений о консультации...'
    statusClass.value = 'status-info'

    const response = await teamsApi.sendConsultationNotification()

    notificationStatus.value = 'Рассылка уведомлений о консультации успешно запущена'
    statusClass.value = 'status-success'
    ElMessage.success('Рассылка уведомлений о консультации успешно запущена')
  } catch (error) {
    console.error('Error sending consultation notifications:', error)
    notificationStatus.value = `Ошибка при отправке уведомлений о консультации: ${error.message || 'Неизвестная ошибка'}`
    statusClass.value = 'status-error'
    ElMessage.error('Ошибка при отправке уведомлений о консультации')
  } finally {
    isConsultationLoading.value = false
  }
}

const handleSendBriefingNotification = async () => {
  try {
    isBriefingLoading.value = true
    notificationStatus.value = 'Отправка уведомлений о брифинге...'
    statusClass.value = 'status-info'

    const response = await teamsApi.sendJudgeBriefingNotification()

    notificationStatus.value = 'Рассылка уведомлений о брифинге успешно запущена'
    statusClass.value = 'status-success'
    ElMessage.success('Рассылка уведомлений о брифинге успешно запущена')
  } catch (error) {
    console.error('Error sending briefing notifications:', error)
    notificationStatus.value = `Ошибка при отправке уведомлений о брифинге: ${error.message || 'Неизвестная ошибка'}`
    statusClass.value = 'status-error'
    ElMessage.error('Ошибка при отправке уведомлений о брифинге')
  } finally {
    isBriefingLoading.value = false
  }
}

const showJudgeSelect = () => {
  judgeSelectVisible.value = true
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
  flex-direction: column;
  gap: 16px;
  align-items: center;
  margin-bottom: 20px;
}

.notification-button {
  width: 100%;
  max-width: 400px;
}

.notification-button:deep(.el-button) {
  margin: 0;
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

.briefing-buttons {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  width: 100%;
}

.briefing-buttons :deep(.el-button) {
  margin: 0;
}
</style>