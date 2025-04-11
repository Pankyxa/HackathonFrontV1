<template>
  <div class="notifications-tab">
    <el-card class="notification-card">
      <template #header>
        <div class="card-header">
          <h3>Рассылка уведомлений</h3>
        </div>
      </template>

      <div class="notification-actions">
        <!-- Общие уведомления -->
        <div class="general-notifications">
          <h4>Общие уведомления</h4>
          <el-button
              type="primary"
              :loading="isClosingCeremonyLoading"
              @click="handleSendClosingCeremonyNotification"
              class="notification-button"
          >
            Разослать уведомления о торжественном закрытии
          </el-button>

          <el-button
              type="primary"
              :loading="isDefenseLoading"
              @click="handleSendDefenseScheduleNotification"
              class="notification-button"
          >
            Разослать уведомления о графике защит
          </el-button>

          <el-button
              type="primary"
              :loading="isOpeningLoading"
              @click="handleSendOpeningNotification"
              class="notification-button"
          >
            Разослать уведомления об открытии хакатона
          </el-button>

          <el-button
              type="primary"
              :loading="isConsultationLoading"
              @click="handleSendConsultationNotification"
              class="notification-button"
          >
            Разослать уведомления о консультации
          </el-button>
          <el-button
              type="primary"
              :loading="isTaskUpdateLoading"
              @click="handleSendTaskUpdateNotification"
              class="notification-button"
          >
            Разослать уведомления о дополнении к исходным данным
          </el-button>
        </div>

        <!-- Уведомления для жюри -->
        <div class="judge-notifications">
          <el-divider>Уведомления для жюри</el-divider>

          <el-button
              type="primary"
              :loading="isJudgeOpeningLoading"
              @click="handleSendJudgeOpeningNotification"
              class="notification-button"
          >
            Разослать уведомления об очном открытии для жюри
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
      </div>

      <div v-if="notificationStatus" class="notification-status" :class="statusClass">
        {{ notificationStatus }}
      </div>
    </el-card>

    <JudgeSelectDialog v-model="judgeSelectVisible"/>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {ElMessage} from 'element-plus'
import {teamsApi} from '@/api/teams'
import JudgeSelectDialog from './JudgeSelectDialog.vue'

const isClosingCeremonyLoading = ref(false)
const isDefenseLoading = ref(false)
const isOpeningLoading = ref(false)
const isConsultationLoading = ref(false)
const isBriefingLoading = ref(false)
const isTaskUpdateLoading = ref(false)
const isJudgeOpeningLoading = ref(false)
const notificationStatus = ref('')
const statusClass = ref('')
const judgeSelectVisible = ref(false)

const handleSendClosingCeremonyNotification = async () => {
  try {
    isClosingCeremonyLoading.value = true
    notificationStatus.value = 'Отправка уведомлений о торжественном закрытии...'
    statusClass.value = 'status-info'

    const response = await teamsApi.sendClosingCeremonyNotification()

    notificationStatus.value = 'Рассылка уведомлений о торжественном закрытии успешно запущена'
    statusClass.value = 'status-success'
    ElMessage.success('Рассылка уведомлений о торжественном закрытии успешно запущена')
  } catch (error) {
    console.error('Error sending closing ceremony notifications:', error)
    notificationStatus.value = `Ошибка при отправке уведомлений о торжественном закрытии: ${error.message || 'Неизвестная ошибка'}`
    statusClass.value = 'status-error'
    ElMessage.error('Ошибка при отправке уведомлений о торжественном закрытии')
  } finally {
    isClosingCeremonyLoading.value = false
  }
}

const handleSendDefenseScheduleNotification = async () => {
  try {
    isDefenseLoading.value = true
    notificationStatus.value = 'Отправка уведомлений о защите проектов...'
    statusClass.value = 'status-info'

    const response = await teamsApi.sendDefenseScheduleNotification()

    notificationStatus.value = 'Рассылка уведомлений о защите проектов успешно запущена'
    statusClass.value = 'status-success'
    ElMessage.success('Рассылка уведомлений о защите проектов успешно запущена')
  } catch (error) {
    console.error('Error sending opening notifications:', error)
    notificationStatus.value = `Ошибка при отправке уведомлений о защите проектов: ${error.message || 'Неизвестная ошибка'}`
    statusClass.value = 'status-error'
    ElMessage.error('Ошибка при отправке уведомлений о защите проектов')
  } finally {
    isDefenseLoading.value = false
  }
}

const handleSendOpeningNotification = async () => {
  try {
    isOpeningLoading.value = true
    notificationStatus.value = 'Отправка уведомлений об открытии хакатона...'
    statusClass.value = 'status-info'

    const response = await teamsApi.sendOpeningNotification()

    notificationStatus.value = 'Рассылка уведомлений об открытии хакатона успешно запущена'
    statusClass.value = 'status-success'
    ElMessage.success('Рассылка уведомлений об открытии хакатона успешно запущена')
  } catch (error) {
    console.error('Error sending opening notifications:', error)
    notificationStatus.value = `Ошибка при отправке уведомлений об открытии: ${error.message || 'Неизвестная ошибка'}`
    statusClass.value = 'status-error'
    ElMessage.error('Ошибка при отправке уведомлений об открытии хакатона')
  } finally {
    isOpeningLoading.value = false
  }
}

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

const handleSendTaskUpdateNotification = async () => {
  try {
    isTaskUpdateLoading.value = true
    notificationStatus.value = 'Отправка уведомлений о дополнении к исходным данным...'
    statusClass.value = 'status-info'

    const response = await teamsApi.sendTaskUpdateNotification()

    notificationStatus.value = 'Рассылка уведомлений о дополнении успешно запущена'
    statusClass.value = 'status-success'
    ElMessage.success('Рассылка уведомлений о дополнении успешно запущена')
  } catch (error) {
    console.error('Error sending task update notifications:', error)
    notificationStatus.value = `Ошибка при отправке уведомлений о дополнении: ${error.message || 'Неизвестная ошибка'}`
    statusClass.value = 'status-error'
    ElMessage.error('Ошибка при отправке уведомлений о дополнении')
  } finally {
    isTaskUpdateLoading.value = false
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

const handleSendJudgeOpeningNotification = async () => {
  try {
    isJudgeOpeningLoading.value = true
    notificationStatus.value = 'Отправка уведомлений об очном открытии для жюри...'
    statusClass.value = 'status-info'

    const response = await teamsApi.sendJudgeOpeningNotification()

    notificationStatus.value = 'Рассылка уведомлений об очном открытии для жюри успешно запущена'
    statusClass.value = 'status-success'
    ElMessage.success('Рассылка уведомлений об очном открытии для жюри успешно запущена')
  } catch (error) {
    console.error('Error sending judge opening notifications:', error)
    notificationStatus.value = `Ошибка при отправке уведомлений об очном открытии для жюри: ${error.message || 'Неизвестная ошибка'}`
    statusClass.value = 'status-error'
    ElMessage.error('Ошибка при отправке уведомлений об очном открытии для жюри')
  } finally {
    isJudgeOpeningLoading.value = false
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
  gap: 24px;
  margin-bottom: 20px;
}

.general-notifications,
.judge-notifications {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  width: 100%;
}

.general-notifications h4 {
  margin: 0 0 8px 0;
  color: #606266;
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

.el-divider {
  margin: 8px 0;
}
</style>