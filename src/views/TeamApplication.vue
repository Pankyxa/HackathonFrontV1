<template>
  <div class="page-wrapper">
    <TheHeader/>
    <div class="page-container">
      <div class="application-container">
        <!-- Custom Stepper -->
        <div class="steps-wrapper">
          <div class="step-item" :class="{ 'active': currentStep >= 0, 'completed': currentStep > 0 }">
            <div class="step-circle">1</div>
            <div class="step-title">Информация о команде</div>
          </div>
          <div class="step-connector" :class="{ 'active': currentStep > 0 }"></div>
          <div class="step-item" :class="{ 'active': currentStep >= 1, 'completed': currentStep > 1 }">
            <div class="step-circle">2</div>
            <div class="step-title">Участники команды</div>
          </div>
          <div class="step-connector" :class="{ 'active': currentStep > 1 }"></div>
          <div class="step-item" :class="{ 'active': currentStep >= 2, 'completed': currentStep > 2 }">
            <div class="step-circle">3</div>
            <div class="step-title">Завершение</div>
          </div>
        </div>

        <!-- Scrollable Content Area -->
        <div class="content-scroll-area">
          <!-- Step 1: Team Info -->
          <div v-if="currentStep === 0" class="step-content">
          <el-form :model="teamForm" class="team-form">
            <el-form-item required>
              <label class="form-label">Название команды</label>
              <el-input v-model="teamForm.name" placeholder="Введите название команды" class="form-input" />
            </el-form-item>
            <el-form-item required>
              <label class="form-label">Девиз команды</label>
              <el-input
                  v-model="teamForm.motto"
                  type="textarea"
                  :rows="3"
                  placeholder="Введите девиз команды"
                  class="form-input"
              />
            </el-form-item>
            <el-form-item required>
              <label class="form-label">Фото команды</label>
              <TeamPhotoEditor v-model="teamForm.photo" />
            </el-form-item>
          </el-form>
        </div>

        <!-- Step 2: Members -->
        <div v-if="currentStep === 1" class="step-content">
          <div class="members-info">
            <div class="members-list">
              <div v-for="(member, index) in teamForm.members" :key="member.id" class="member-card">
                <div class="member-info">
                  <div class="member-name">{{ member.full_name }}</div>
                  <div class="member-details">{{ member.vuz }} | {{ member.course }} курс</div>
                </div>
                <el-button
                    type="danger"
                    circle
                    size="small"
                    @click="removeMember(index)"
                    class="remove-button"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
            
            <button
                @click="showUserSearch"
                class="add-member-button"
                :disabled="teamForm.members.length >= 4"
            >
              <el-icon class="add-icon"><Plus /></el-icon>
              Добавить участника
            </button>

            <p class="note">
              * Максимальное количество участников: 4
            </p>
            <p class="note">
              Если ещё не все ваши участники зарегистрировались, ничего страшного — вы сможете добавить их позже.
            </p>
          </div>

            <UserSearchModal
                v-model="showSearchModal"
                :existing-members="teamForm.members"
                @select="handleMemberSelect"
            />
          </div>

          <!-- Step 3: Success -->
          <div v-if="currentStep === 2" class="step-content success-step">
            <el-result
                icon="success"
                title="Команда успешно создана!"
                sub-title="Команда станет активной после подтверждения всех участников"
            >
              <template #extra>
                <el-button type="primary" @click="handleFinish" class="finish-button">
                  Завершить
                </el-button>
              </template>
            </el-result>
          </div>

          <!-- Form Actions -->
          <div class="form-actions" v-if="currentStep !== 2">
            <el-button @click="prevStep" v-if="currentStep > 0" class="action-button-secondary">
              Назад
            </el-button>
            <el-button type="primary" @click="nextStep" :disabled="!canProceed" class="action-button-primary">
              {{ currentStep === 1 ? 'Создать команду' : 'Далее' }}
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue';
import { Delete, Plus } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import TeamPhotoEditor from '@/components/team/TeamPhotoEditor.vue';
import { teamsApi } from '@/api/teams';
import {useAuthStore} from "@/stores/auth.js";
import UserSearchModal from '@/components/team/UserSearchModal.vue';
import { ElMessage } from 'element-plus';
import TheHeader from "@/components/TheHeader.vue";

const authStore = useAuthStore();
const router = useRouter();
const currentStep = ref(0);
const showSearchModal = ref(false);
const teamForm = ref({
  name: '',
  motto: '',
  photo: null,
  members: []
});
const store = useAuthStore()
const isHaveTeam = store.isHaveTeam

onMounted(() => {
  if (isHaveTeam){
    router.push('/')
  }
})

const canProceed = computed(() => {
  if (currentStep.value === 0) {
    return teamForm.value.name && teamForm.value.motto && teamForm.value.photo;
  }
  return true;
});

const handlePhotoChange = (file) => {
  teamForm.value.photo = file.raw;
};

const showUserSearch = () => {
  if (teamForm.value.members.length < 5) {
    showSearchModal.value = true;
  }
};

const handleMemberSelect = (user) => {
  if (teamForm.value.members.length >= 4) {
    ElMessage.warning('Максимальное количество участников: 4');
    return;
  }
  teamForm.value.members.push(user);
};

const removeMember = (index) => {
  teamForm.value.members.splice(index, 1);
    };

const createTeam = async () => {
  try {
    const formattedData = {
      team_name: teamForm.value.name,
      team_motto: teamForm.value.motto,
      logo: teamForm.value.photo,
      member_ids: teamForm.value.members.length > 0
          ? JSON.stringify(teamForm.value.members.map(member => member.id))
          : JSON.stringify([])
    };

    await teamsApi.createTeam(formattedData);
    await authStore.initializeAuth();
    currentStep.value = 2;
  } catch (error) {
    console.error('Ошибка при создании команды:', error);
    if (error.message === 'Некорректный формат файла логотипа') {
      ElMessage.error('Пожалуйста, загрузите корректный файл логотипа');
    } else {
      ElMessage.error('Не удалось создать команду. Пожалуйста, попробуйте снова.');
    }
  }
};

const nextStep = async () => {
  if (currentStep.value === 1) {
    await createTeam();
  } else if (currentStep.value < 2) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

const handleFinish = () => {
  router.push('/');
};
</script>

<style scoped>
/* Fixed Layout - Application container is fixed with internal scroll */
.page-wrapper {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #f8fafc; /* bg-slate-50 */
}

.page-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 20px 48px; /* Увеличиваем верхний отступ для более низкого расположения бокса */
  background-color: #f8fafc; /* bg-slate-50 */
  overflow: hidden; /* No scroll on page container */
}

.application-container {
  width: 100%;
  max-width: 800px;
  height: calc(100vh - 64px - 96px); /* Full height minus header (64px) and top/bottom padding (48px * 2) */
  margin: 0 auto;
  background: white; /* bg-white */
  border-radius: 12px; /* rounded-xl */
  padding: 40px; /* p-10 */
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); /* shadow-xl */
  border: 1px solid #e2e8f0; /* border border-slate-200 */
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Container itself doesn't scroll */
}

/* Scrollable content area inside container */
.content-scroll-area {
  flex: 1;
  overflow-y: auto;
  min-height: 0; /* Important for flex scrolling */
  padding-right: 8px; /* Space for scrollbar */
  margin-right: -8px; /* Compensate for padding */
}

/* Custom scrollbar for content area */
.content-scroll-area::-webkit-scrollbar {
  width: 6px;
}

.content-scroll-area::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.content-scroll-area::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.content-scroll-area::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Custom Stepper */
.steps-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 48px;
  gap: 8px;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
  max-width: 200px;
}

.step-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  color: #94a3b8; /* text-slate-400 */
  background: white;
  border: 2px solid #cbd5e1; /* border-slate-300 */
  transition: all 0.3s ease;
}

.step-item.active .step-circle {
  color: #2563eb; /* text-blue-600 */
  border-color: #2563eb; /* border-blue-600 */
  background: #eff6ff; /* bg-blue-50 */
}

.step-item.completed .step-circle {
  color: white;
  background: #2563eb; /* bg-blue-600 */
  border-color: #2563eb;
}

.step-title {
  font-size: 14px;
  color: #64748b; /* text-slate-500 */
  text-align: center;
  font-weight: 500;
  transition: color 0.3s ease;
}

.step-item.active .step-title {
  color: #2563eb; /* text-blue-600 */
  font-weight: 600;
}

.step-connector {
  flex: 1;
  height: 2px;
  background: #e2e8f0; /* bg-slate-200 */
  margin: 0 8px;
  transition: background 0.3s ease;
}

.step-connector.active {
  background: #2563eb; /* bg-blue-600 */
}

.step-content {
  margin-top: 32px;
}

/* Form Styles */
.team-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-label {
  display: block;
  font-size: 14px; /* text-sm */
  font-weight: 500; /* font-medium */
  color: #334155; /* text-slate-700 */
  margin-bottom: 8px; /* mb-1 */
}

.form-input :deep(.el-input__wrapper),
.form-input :deep(.el-textarea__inner) {
  padding: 10px 12px; /* px-3 py-2 */
  border: 1px solid #cbd5e1; /* border-slate-300 */
  border-radius: 8px; /* rounded-lg */
  box-shadow: none;
  transition: all 0.2s ease;
}

.form-input :deep(.el-input__wrapper.is-focus),
.form-input :deep(.el-textarea__inner.is-focus) {
  border-color: #2563eb; /* focus:border-blue-500 */
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); /* focus:ring-2 focus:ring-blue-500 */
}

.form-input :deep(.el-input__inner),
.form-input :deep(.el-textarea__inner) {
  color: #1e293b; /* text-slate-800 */
  font-size: 16px;
}

/* Members List */
.members-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.member-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px; /* p-3 */
  background: white; /* bg-white */
  border: 1px solid #e2e8f0; /* border */
  border-radius: 8px; /* rounded-lg */
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
  transition: all 0.2s ease;
}

.member-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.member-info {
  flex: 1;
}

.member-name {
  font-weight: 600; /* font-bold */
  color: #1e293b; /* text-slate-800 */
  font-size: 16px;
  margin-bottom: 4px;
}

.member-details {
  font-size: 14px;
  color: #64748b; /* text-slate-500 */
}

.remove-button {
  flex-shrink: 0;
  margin-left: 12px;
}

/* Add Member Button - Dashed Outline */
.add-member-button {
  width: 100%;
  padding: 12px 16px; /* py-3 */
  border: 2px dashed #cbd5e1; /* border-2 border-dashed border-slate-300 */
  border-radius: 8px; /* rounded-lg */
  background: white;
  color: #475569; /* text-slate-600 */
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
}

.add-member-button:hover:not(:disabled) {
  border-color: #2563eb; /* hover:border-blue-500 */
  color: #2563eb; /* hover:text-blue-600 */
  background: #f8fafc;
}

.add-member-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.add-icon {
  font-size: 18px;
}

.note {
  color: #64748b; /* text-slate-500 */
  font-size: 14px;
  margin-top: 16px;
  text-align: center;
  line-height: 1.5;
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 40px;
  padding-top: 32px;
  border-top: 1px solid #e2e8f0;
}

.action-button-secondary {
  background: white;
  color: #475569; /* text-slate-600 */
  border: 1px solid #e2e8f0;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.action-button-secondary:hover {
  background: #f1f5f9; /* hover:bg-slate-100 */
  border-color: #cbd5e1;
}

.action-button-primary {
  background: #2563eb; /* bg-blue-600 */
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 500;
  transition: background 0.2s ease;
}

.action-button-primary:hover:not(:disabled) {
  background: #1d4ed8; /* hover:bg-blue-700 */
}

.action-button-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.finish-button {
  background: #2563eb; /* bg-blue-600 */
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 8px;
  font-weight: 500;
  transition: background 0.2s ease;
}

.finish-button:hover {
  background: #1d4ed8; /* hover:bg-blue-700 */
}

.success-step {
  text-align: center;
  padding: 40px 0;
}

@media (max-width: 768px) {
  .page-container {
    padding: 24px 16px;
  }

  .application-container {
    height: calc(100vh - 64px - 48px); /* Less padding on mobile */
    padding: 24px;
    border-radius: 12px;
  }

  .steps-wrapper {
    gap: 4px;
    margin-bottom: 32px;
  }

  .step-circle {
    width: 32px;
    height: 32px;
    font-size: 12px;
  }

  .step-title {
    font-size: 12px;
  }

  .step-connector {
    margin: 0 4px;
  }

  .form-actions {
    flex-direction: column;
    gap: 8px;
  }

  .form-actions .el-button {
    width: 100%;
  }

  .member-card {
    padding: 10px;
  }

  .member-name {
    font-size: 14px;
  }

  .member-details {
    font-size: 12px;
  }
}
</style>
