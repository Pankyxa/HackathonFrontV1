<template>
  <PrimaryLayout>
    <div class="wrapper">
      <div class="wrapper__main-container">
        <h1 class="main-container-name">Регистрация</h1>
        <AuthForm
            :loading="loading"
            :fields="registrationFields"
            submit-button-text="Зарегистрироваться"
            submit-loading-text="Регистрация..."
            secondary-button-text="Войти"
            @submit="submitRegistration"
            @secondary-action="moveToLogin"
            @update:model-value="updateFormModel"
            @download-terms="downloadTerms"
            @download-consent="downloadConsent"
            class="registration-form"
        />
      </div>
    </div>
  </PrimaryLayout>
</template>

<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import PrimaryLayout from '../components/PrimaryLayout.vue';
import AuthForm from '../components/auth/AuthForm.vue';
import { useRouter } from 'vue-router';
import { authApi } from '../api/auth';

const router = useRouter();
const loading = ref(false);
const formModel = ref({});
const updateFormModel = (newValue) => {
  formModel.value = newValue;
};

const downloadTerms = () => {
  const link = document.createElement('a');
  link.href = '/files/Положение о хакатоне Цифровые двойники в энергетике.pdf';
  link.target = '_blank';
  link.click();
};

const downloadConsent = () => {
  const link = document.createElement('a');
  link.href = '/files/Согласия хакатон Цифровые двойники в энергетике.pdf';
  link.download = 'Шаблон согласия.pdf';
  link.click();
};

const registrationFields = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Введите email',
    rules: [
      { required: true, message: 'Пожалуйста, введите почту', trigger: 'blur' },
      { type: 'email', message: 'Почта введена некорректно', trigger: ['blur', 'change'] }
    ]
  },
  {
    name: 'full_name',
    label: 'ФИО',
    type: 'text',
    placeholder: 'Введите ФИО',
    rules: [
      { required: true, message: 'Пожалуйста, введите ФИО', trigger: 'blur' }
    ]
  },
  {
    name: 'password',
    label: 'Пароль',
    type: 'password',
    placeholder: 'Введите пароль',
    rules: [
      { required: true, message: 'Пожалуйста, введите пароль', trigger: 'blur' },
      { min: 6, message: 'Минимум 6 символов', trigger: 'blur' }
    ]
  },
  {
    name: 'confirmPassword',
    label: 'Повторите пароль',
    type: 'password',
    placeholder: 'Повторите пароль',
    rules: [
      { required: true, message: 'Пожалуйста, повторите пароль', trigger: 'blur' },
      {
        validator: (rule, value, callback) => {
          if (!value) {
            callback(new Error('Пожалуйста, повторите пароль'));
          } else if (value !== formModel.value.password) {
            callback(new Error('Пароли не совпадают'));
          } else {
            callback();
          }
        },
        trigger: ['blur', 'change']
      }
    ]
  },
  {
    name: 'number',
    label: 'Телефон',
    type: 'text',
    placeholder: '+7 (___) ___-__-__',
    rules: [
      { required: true, message: 'Пожалуйста, введите номер телефона', trigger: 'blur' },
      {
        pattern: /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/,
        message: 'Введите корректный номер телефона',
        trigger: 'blur'
      }
    ]
  },
  {
    name: 'vuz',
    label: 'ВУЗ',
    type: 'text',
    placeholder: 'Введите название ВУЗа',
    rules: [
      { required: true, message: 'Пожалуйста, введите название ВУЗа', trigger: 'blur' }
    ]
  },
  {
    name: 'vuz_direction',
    label: 'Направление',
    type: 'text',
    placeholder: 'Введите направление обучения',
    rules: [
      { required: true, message: 'Пожалуйста, введите направление обучения', trigger: 'blur' }
    ]
  },
  {
    name: 'code_speciality',
    label: 'Код спец.',
    type: 'text',
    placeholder: '__.__.__ ',
    rules: [
      { required: true, message: 'Пожалуйста, введите код специальности', trigger: 'blur' },
      {
        pattern: /^\d{2}\.\d{2}\.\d{2}$/,
        message: 'Формат: XX.XX.XX, где X - цифры',
        trigger: 'blur'
      }
    ]
  },
  {
    name: 'course',
    label: 'Курс',
    type: 'select',
    placeholder: 'Выберите курс',
    options: [
      { value: '1', label: '1 курс' },
      { value: '2', label: '2 курс' },
      { value: '3', label: '3 курс' },
      { value: '4', label: '4 курс' },
      { value: '5', label: '5 курс' },
      { value: '6', label: '6 курс' }
    ],
    rules: [
      { required: true, message: 'Пожалуйста, выберите курс', trigger: 'change' }
    ]
  },
  {
    name: 'education_certificate_file',
    label: 'Справка с места учёбы',
    type: 'file',
    placeholder: 'Прикрепите справку с места учебы',
    rules: [
      {
        required: true,
        message: 'Пожалуйста, прикрепите справку с места учебы',
        trigger: 'change'
      },
      {
        validator: (rule, value, callback) => {
          if (!value) {
            callback(new Error('Пожалуйста, прикрепите файл'));
            return;
          }
          const file = formModel.value.education_certificate_file;
          if (file) {
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
              callback(new Error('Размер файла не должен превышать 5MB'));
              return;
            }
            const allowedTypes = ['application/pdf'];
            if (!allowedTypes.includes(file.type)) {
              callback(new Error('Допустимые форматы: PDF'));
              return;
            }
          }
          callback();
        },
        trigger: 'change'
      }
    ]
  },
  {
    name: 'consent_file',
    label: 'Согласия',
    type: 'file',
    placeholder: 'Прикрепите согласие на обработку ПД',
    tooltip: 'Распечатайте согласия, заполните их, отсканируйте и прикрепите в одном файле в формате pdf',
    downloadTemplate: true,
    rules: [
      {
        required: true,
        message: 'Пожалуйста, прикрепите согласие на обработку персональных данных',
        trigger: 'change'
      },
      {
        validator: (rule, value, callback) => {
          if (!value) {
            callback(new Error('Пожалуйста, прикрепите файл'));
            return;
          }
          const file = formModel.value.consent_file;
          if (file) {
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
              callback(new Error('Размер файла не должен превышать 5MB'));
              return;
            }
            const allowedTypes = ['application/pdf'];
            if (!allowedTypes.includes(file.type)) {
              callback(new Error('Допустимые форматы: PDF'));
              return;
            }
          }
          callback();
        },
        trigger: 'change'
      }
    ]
  },
  {
    name: 'terms_accepted',
    type: 'checkbox',
    label: ' ',
    customContent: '',
    rules: [
      {
        validator: (rule, value, callback) => {
          if (!value) {
            callback(new Error('Необходимо принять условия проведения хакатона'));
          } else {
            callback();
          }
        },
        trigger: 'change'
      }
    ]
  },
];

const submitRegistration = async (formData) => {
  try {
    loading.value = true;
    const dataToSend = { ...formData };
    delete dataToSend.confirmPassword;
    delete dataToSend.terms_accepted;
    await authApi.register(dataToSend);
    ElMessage.success('Регистрация успешна!');
  router.push('/login');
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    ElMessage.error(error?.detail || 'Ошибка при регистрации');
  } finally {
    loading.value = false;
  }
};

const moveToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: calc(100vh - 338px);
}

.wrapper__main-container {
  color: black;
  margin: 0 auto;
  padding: 30px;
  box-shadow: 1px 2px 2px 3px rgba(0, 0, 0, 0.2);
  width: 800px;
  text-align: center;
  border-radius: 8px;
  background: white;
  max-height: 60vh;
  display: flex;
  flex-direction: column;
}

.main-container-name {
  padding-bottom: 20px;
  font-size: 24px;
  color: #409EFF;
  flex-shrink: 0;
  font-weight: bold;
}

.registration-form {
  text-align: left;
  overflow-y: auto;
  padding-right: 10px;
}

.registration-form::-webkit-scrollbar {
  width: 8px;
}

.registration-form::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.registration-form::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.registration-form::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.registration-form :deep(.button-container) {
  position: sticky;
  bottom: 0;
  background: white;
  padding-top: 20px;
  margin-top: auto;
}

.registration-form :deep(.el-form-item__label) {
  white-space: nowrap;
  height: auto;
  line-height: 1.2;
  padding-bottom: 8px;
  font-size: 14px;
  width: 110px !important;
}

.registration-form :deep(.el-form-item) {
  margin-bottom: 35px;
  position: relative;
}

.registration-form :deep(.el-input) {
  width: 100%;
}

.registration-form :deep(.el-form-item__button-container) {
  grid-column: 1 / -1;
  margin-top: 20px;
  text-align: center;
}

.registration-form :deep(.el-form-item__content) {
  margin-left: 110px !important;
}

.registration-form :deep(.el-form-item__error) {
  position: absolute;
  top: 100%;
  left: 0;
  margin-left: 0;
  color: var(--el-color-danger);
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
}

.registration-form :deep(.el-checkbox__label) {
  white-space: normal;
  line-height: 1.4;
}

.registration-form :deep(.el-checkbox) {
  margin-right: 0;
  align-items: flex-start;
}

.registration-form :deep(.el-checkbox__inner) {
  margin-top: 3px;
}

@media (max-width: 768px) {
  .wrapper__main-container {
    width: 95%;
    padding: 20px;
    margin: 10px;
  }
  .registration-form :deep(.el-form-item) {
    margin-bottom: 20px !important;
  }

  .registration-form :deep(.el-form) {
    grid-template-columns: 1fr;
    gap: 20px !important;
  }

  .registration-form :deep(.el-form-item__label) {
    width: 100px !important;
  }

  .registration-form :deep(.el-form-item__content) {
    margin-left: 100px !important;
  }

  .registration-form :deep(.el-form-item__error) {
    margin-left: 100px;
  }
}
</style>