<template>
  <TheHeader/>
    <div class="page-container">
      <div class="application-container">
        <el-steps :active="currentStep" finish-status="success" class="steps-wrapper">
          <el-step title="Информация о команде" />
          <el-step title="Участники команды" />
          <el-step title="Завершение" />
        </el-steps>

        <div v-if="currentStep === 0" class="step-content">
          <el-form :model="teamForm" label-position="top">
            <el-form-item label="Название команды" required>
              <el-input v-model="teamForm.name" placeholder="Введите название команды" />
            </el-form-item>
            <el-form-item label="Девиз команды" required>
              <el-input
                  v-model="teamForm.motto"
                  type="textarea"
                  placeholder="Введите девиз команды"
              />
            </el-form-item>
            <el-form-item label="Фото команды" required>
              <TeamPhotoEditor v-model="teamForm.photo" />
            </el-form-item>
          </el-form>
        </div>

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
                    @click="removeMember(index)"
                    class="remove-button"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
            <el-button
                type="primary"
                @click="showUserSearch"
                class="add-member-button"
                :disabled="teamForm.members.length >= 4"
            >
              Добавить участника
              </el-button>

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

        <div class="form-actions" v-if="currentStep !== 2">
          <el-button @click="prevStep" v-if="currentStep > 0">
            Назад
          </el-button>
          <el-button type="primary" @click="nextStep" :disabled="!canProceed">
            {{ currentStep === 1 ? 'Создать команду' : 'Далее' }}
          </el-button>
        </div>
      </div>
    </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue';
import { Delete } from '@element-plus/icons-vue';
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
.page-container {
  margin: 105px 20px 20px;
  height: calc(100vh - 125px);
}

.application-container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  height: 100%;
}

.steps-wrapper {
  margin-bottom: 40px;
}

.step-content {
  margin-top: 30px;
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 24px;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
}

.member-item {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.note {
  color: #666;
  font-size: 14px;
  margin-top: 20px;
  text-align: center;
}

.team-photo-uploader {
  display: flex;
  justify-content: center;
}

.upload-button,
.finish-button,
.add-member-button {
  background: linear-gradient(90deg, #00A3FF 0%, #5B51D8 100%);
  border: none;
  padding: 12px 40px;
  font-size: 16px;
  border-radius: 8px;
  transition: opacity 0.3s ease;
}

.upload-button:hover,
.finish-button:hover,
.add-member-button:hover {
  opacity: 0.9;
}

.add-member-button {
  width: 100%;
  margin-top: 20px;
}

.success-step {
  text-align: center;
  padding: 40px 0;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-step__title) {
  font-size: 16px;
}

.members-list {
  display: flex;
    flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
  }

.member-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: #F5F7FA;
  border-radius: 8px;
  transition: background-color 0.3s;
  }

.member-card:hover {
  background-color: #EBEEF5;
  }

.member-info {
  flex: 1;
  }

.member-name {
  font-weight: 500;
  color: #303133;
}

.member-details {
  font-size: 13px;
  color: #909399;
  margin-top: 4px;
}

.remove-button {
  flex-shrink: 0;
  margin-left: 12px;
}

@media (max-width: 768px) {
  .page-container {
    padding: 20px 10px;
  }

  .application-container {
    padding: 20px 15px;
    border-radius: 12px;
  }

  .page-title {
    font-size: 24px;
    margin-bottom: 30px;
  }

  .form-actions {
    flex-direction: column;
    padding: 0 20px;
  }

  .form-actions .el-button {
    width: 100%;
  }

  .member-item {
    flex-direction: column;
  }

  :deep(.el-step__title) {
    font-size: 14px;
  }
}
</style>
