<template>
  <div class="wrapper-for-correct-viewport">
    <TheHeader></TheHeader>
    <div class="wrapper">
      <div class="wrapper__main-container">
        <h1 class="main-container-name">Страница жюри</h1>
        <AuthForm
            :loading="loading"
            :fields="judgeFields"
            submit-button-text="Сохранить оценки"
            submit-loading-text="Сохранение..."
            secondary-button-text="Отменить изменения"
            @submit="submitGrades"
            @secondary-action="moveToJudgeTeams"
            class="grades-form"
        /> <!-- todo: при нажатии "отменить изменения" будет отправлять обратно на страницу жюри со списком команд -->
      </div>
    </div>
    <TheFooter></TheFooter>
  </div>
</template>

<script setup>
import TheHeader from "@/components/TheHeader.vue";
import TheFooter from "@/components/TheFooter.vue";
import AuthForm from "@/components/auth/AuthForm.vue";
import {useRouter} from "vue-router";
import {ref} from "vue";

const router = useRouter();
const loading = ref(false);

const checkGradeCorrection = function(rule, value, callback) {
  const number = Number(value);
  if (isNaN(number)) {
    callback(new Error("Значение должно быть числом"));
  }
  else if (number < 1 || number > 10) {
    callback(new Error("Оценка только от 1 до 10"));
  }
}

const judgeFields = [
  {
    name: 'criterion_1',
    label: 'Критерий 1:',
    placeholder: 'Введите оценку',
    rules: [
      { required: true, message: 'Пожалуйста, введите оценку', trigger: 'blur' },
      { validator: checkGradeCorrection, trigger: 'blur' },
    ]
  },
  {
    name: 'criterion_2',
    label: 'Критерий 2:',
    placeholder: 'Введите оценку',
    rules: [
      { required: true, message: 'Пожалуйста, введите оценку', trigger: 'blur' },
      { validator: checkGradeCorrection, trigger: 'blur' },
    ]
  },
  {
    name: 'criterion_3',
    label: 'Критерий 3:',
    placeholder: 'Введите оценку',
    rules: [
      { required: true, message: 'Пожалуйста, введите оценку', trigger: 'blur' },
      { validator: checkGradeCorrection, trigger: 'blur' },
    ]
  },
  {
    name: 'criterion_4',
    label: 'Критерий 4:',
    placeholder: 'Введите оценку',
    rules: [
      { required: true, message: 'Пожалуйста, введите оценку', trigger: 'blur' },
      { validator: checkGradeCorrection, trigger: 'blur' },
    ]
  },
  {
    name: 'criterion_5',
    label: 'Критерий 5:',
    placeholder: 'Введите оценку',
    rules: [
      { required: true, message: 'Пожалуйста, введите оценку', trigger: 'blur' },
      { validator: checkGradeCorrection, trigger: 'blur' },
    ]
  },
  {
    name: 'summary',
    label: 'Суммарно:',
    placeholder: 'Суммарная оценка', // todo: в этом поле должна отображаться сумма всех оценок и она должна быть disabled
  },
];
const submitGrades = async (formData) => {
  console.log("пук")
  // todo: сохранение оценок
};
</script>

<style scoped>
.wrapper-for-correct-viewport {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  gap: 10px;
}

.wrapper {
  display: flex;
  margin-top: 10%;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.wrapper__main-container {
  color: black;
  margin: 0 auto;
  padding: 30px;
  box-shadow: 1px 2px 2px 3px rgba(0, 0, 0, 0.2);

  min-width: 40vh;
  text-align: center;
  border-radius: 8px;
  background: white;
}

.main-container-name {
  padding-bottom: 20px;
  font-size: 24px;
  color: #409EFF;
  font-weight: bold;
}

.grades-form {
  text-align: left;
}

.grades-form :deep(.el-form-item__error) {
  position: absolute;
  top: 100%;
  left: 0;
  margin-left: 0;
  color: var(--el-color-danger);
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
}

.grades-form :deep(.el-form-item) {
  margin-bottom: 20px;
}

.grades-form :deep(.el-form-item:last-child) {
  margin-bottom: 17px;
  margin-top: 30px;
}

.grades-form :deep(.el-input) {
  width: 100%;
}

.grades-form :deep(.el-form-item__label) {
  padding-bottom: 8px;
}

@media (max-width: 768px) {
  .wrapper__main-container {
    width: 90%;
    padding: 20px;
    margin: 10px;
  }
}
</style>