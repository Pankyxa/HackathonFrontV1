<template>
  <PrimaryLayout>
    <div class="page-container">
      <h1 class="page-title">Создание команды</h1>
      <div class="application-container">
        <el-steps :active="currentStep" finish-status="success" class="steps-wrapper">
          <el-step title="Информация о команде" />
          <el-step title="Участники команды" />
          <el-step title="Завершение" />
        </el-steps>

        <div v-if="currentStep === 0" class="step-content">
          <h2>Информация о команде</h2>
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
          <h2>Участники команды</h2>
          <div class="members-info">
            <el-form :model="teamForm">
              <div v-for="(member, index) in teamForm.members" :key="index" class="member-item">
                <el-form-item :label="`Участник ${index + 1}`" required>
                  <el-input v-model="member.name" placeholder="ФИО участника" />
                </el-form-item>
                <el-button
                    type="danger"
                    circle
                    @click="removeMember(index)"
                    v-if="teamForm.members.length > 1"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </el-form>
            <el-button type="primary" @click="addMember" class="add-member-button">
              Добавить участника
            </el-button>
            <p class="note">* В дальнейшем вы сможете добавить дополнительных участников</p>
          </div>
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
  </PrimaryLayout>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue';
import { Delete } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import PrimaryLayout from "@/components/PrimaryLayout.vue";
import TeamPhotoEditor from '@/components/TeamPhotoEditor.vue';
import { teamsApi } from '@/api/teams';
import {useAuthStore} from "@/stores/auth.js";

const router = useRouter();
const currentStep = ref(0);
const teamForm = ref({
  name: '',
  motto: '',
  photo: null,
  members: [{ name: '' }]
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
  if (currentStep.value === 1) {
    return teamForm.value.members.every(member => member.name.trim());
  }
  return true;
});

const handlePhotoChange = (file) => {
  teamForm.value.photo = file.raw;
};

const addMember = () => {
  teamForm.value.members.push({ name: '' });
};

const removeMember = (index) => {
  teamForm.value.members.splice(index, 1);
};

const createTeam = async () => {
  try {
    await teamsApi.createTeam(teamForm.value);
    currentStep.value = 2;
  } catch (error) {
    console.error('Ошибка при создании команды:', error);
    ElMessage.error('Не удалось создать команду. Пожалуйста, попробуйте снова.');
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
  router.push('/dashboard');
};
</script>

<style scoped>
.page-container {
  padding: 40px 20px;
}

.page-title {
  text-align: center;
  margin-bottom: 40px;
  font-size: 28px;
  font-weight: bold;
  background: linear-gradient(90deg, #00A3FF 0%, #5B51D8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.application-container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
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
