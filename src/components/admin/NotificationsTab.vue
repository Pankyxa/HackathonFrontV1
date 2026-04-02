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
          :loading="isKickoffMeetingLoading"
          @click="handleSendKickoffMeetingNotification"
          class="notification-button"
        >
          Разослать уведомления об установочной встрече
        </el-button>

        <el-button
          type="success"
          :loading="isOpeningLoading"
          @click="handleSendOpeningNotification"
          class="notification-button"
        >
          Разослать уведомления об открытии хакатона
        </el-button>

        <el-button
          type="info"
          :loading="isDefenseScheduleLoading"
          @click="handleSendDefenseScheduleNotification"
          class="notification-button"
        >
          Разослать уведомления о графике защит
        </el-button>

        <el-button
          type="warning"
          :loading="isKickoffMeetingExtraLoading"
          @click="handleSendKickoffMeetingExtraNotification"
          class="notification-button"
        >
          Отправить только на kbelozerov1@gmail.com
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

const isKickoffMeetingLoading = ref(false)
const isOpeningLoading = ref(false)
const isDefenseScheduleLoading = ref(false)
const isKickoffMeetingExtraLoading = ref(false)
const notificationStatus = ref('')
const statusClass = ref('')

const handleSendKickoffMeetingNotification = async () => {
  try {
    isKickoffMeetingLoading.value = true
    notificationStatus.value = 'Отправка уведомлений об установочной встрече...'
    statusClass.value = 'status-info'

    await teamsApi.sendKickoffMeetingNotification()

    notificationStatus.value = 'Рассылка уведомлений об установочной встрече успешно запущена'
    statusClass.value = 'status-success'
    ElMessage.success('Рассылка уведомлений об установочной встрече успешно запущена')
  } catch (error) {
    console.error('Error sending kickoff meeting notifications:', error)
    notificationStatus.value = `Ошибка при отправке уведомлений об установочной встрече: ${error.message || 'Неизвестная ошибка'}`
    statusClass.value = 'status-error'
    ElMessage.error('Ошибка при отправке уведомлений об установочной встрече')
  } finally {
    isKickoffMeetingLoading.value = false
  }
}

const handleSendKickoffMeetingExtraNotification = async () => {
  try {
    isKickoffMeetingExtraLoading.value = true
    notificationStatus.value = 'Отправка уведомления об установочной встрече на дополнительную почту...'
    statusClass.value = 'status-info'

    await teamsApi.sendKickoffMeetingExtraNotification()

    notificationStatus.value = 'Уведомление об установочной встрече на kbelozerov1@gmail.com успешно запущено'
    statusClass.value = 'status-success'
    ElMessage.success('Уведомление на kbelozerov1@gmail.com успешно запущено')
  } catch (error) {
    console.error('Error sending extra kickoff meeting notification:', error)
    notificationStatus.value = `Ошибка при отправке уведомления на дополнительную почту: ${error.message || 'Неизвестная ошибка'}`
    statusClass.value = 'status-error'
    ElMessage.error('Ошибка при отправке уведомления на дополнительную почту')
  } finally {
    isKickoffMeetingExtraLoading.value = false
  }
}

const handleSendOpeningNotification = async () => {
  try {
    isOpeningLoading.value = true
    notificationStatus.value = 'Отправка уведомлений об открытии хакатона...'
    statusClass.value = 'status-info'

    await teamsApi.sendOpeningNotification()

    notificationStatus.value = 'Рассылка уведомлений об открытии хакатона успешно запущена'
    statusClass.value = 'status-success'
    ElMessage.success('Рассылка уведомлений об открытии хакатона успешно запущена')
  } catch (error) {
    console.error('Error sending opening notifications:', error)
    notificationStatus.value = `Ошибка при отправке уведомлений об открытии хакатона: ${error.message || 'Неизвестная ошибка'}`
    statusClass.value = 'status-error'
    ElMessage.error('Ошибка при отправке уведомлений об открытии хакатона')
  } finally {
    isOpeningLoading.value = false
  }
}

const handleSendDefenseScheduleNotification = async () => {
  try {
    isDefenseScheduleLoading.value = true
    notificationStatus.value = 'Отправка уведомлений о графике защит...'
    statusClass.value = 'status-info'

    await teamsApi.sendDefenseScheduleNotification()

    notificationStatus.value = 'Рассылка уведомлений о графике защит успешно запущена'
    statusClass.value = 'status-success'
    ElMessage.success('Рассылка уведомлений о графике защит успешно запущена')
  } catch (error) {
    console.error('Error sending defense schedule notifications:', error)
    notificationStatus.value = `Ошибка при отправке уведомлений о графике защит: ${error.message || 'Неизвестная ошибка'}`
    statusClass.value = 'status-error'
    ElMessage.error('Ошибка при отправке уведомлений о графике защит')
  } finally {
    isDefenseScheduleLoading.value = false
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 20px;
}

.notification-button {
  width: 100%;
  max-width: 460px;
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
