<template>
  <TheHeader/>
  <div class="registration-wrapper">
    <div class="registration-card">
      <h1 class="registration-title">Регистрация</h1>
      
      <!-- Segmented Control -->
      <div class="segmented-control">
        <button
            :class="['segment', { active: selectedRole === 'participant' }]"
            @click="handleRoleChange('participant')"
        >
          Для участников
        </button>
        <button
            :class="['segment', { active: selectedRole === 'mentor' }]"
            @click="handleRoleChange('mentor')"
        >
          Для наставников
        </button>
      </div>

      <AuthForm
          ref="authFormRef"
          :loading="loading"
          :fields="currentFields"
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

      <div class="login-link-section">
        <span class="login-link-text">Уже есть аккаунт?</span>
        <el-button
            type="primary"
            link
            @click="moveToLogin"
            class="login-link-button"
        >
          Войти
        </el-button>
      </div>
    </div>
  </div>

  <EmailVerificationModal
      v-model="showVerificationModal"
      :email="registeredEmail"
      @update:modelValue="handleVerificationModalClose"
  />
</template>

<script setup>
import {ref, computed, nextTick} from 'vue';
import {ElMessage} from 'element-plus';
import AuthForm from '../components/auth/AuthForm.vue';
import {useRouter} from 'vue-router';
import {authApi} from '../api/auth';
import EmailVerificationModal from "@/components/auth/EmailVerificationModal.vue";
import TheHeader from "@/components/TheHeader.vue";

const router = useRouter();
const loading = ref(false);
const formModel = ref({});
const selectedRole = ref('participant');
const authFormRef = ref(null);

const showVerificationModal = ref(false);
const registeredEmail = ref('');

const handleVerificationModalClose = () => {
  showVerificationModal.value = false;
  router.push('/login');
};

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
  link.href = '/files/Шаблон согласия.pdf';
  link.target = 'Шаблон согласия.pdf';
  link.click();
};

const participantFields = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Введите email',
    rules: [
      {required: true, message: 'Пожалуйста, введите почту', trigger: 'blur'},
      {type: 'email', message: 'Почта введена некорректно', trigger: ['blur', 'change']}
    ]
  },
  {
    name: 'password',
    label: 'Пароль',
    type: 'password',
    placeholder: 'Введите пароль',
    rules: [
      {required: true, message: 'Пожалуйста, введите пароль', trigger: 'blur'},
      {min: 6, message: 'Минимум 6 символов', trigger: 'blur'}
    ]
  },
  {
    name: 'confirmPassword',
    label: 'Повторите пароль',
    type: 'password',
    placeholder: 'Повторите пароль',
    rules: [
      {required: true, message: 'Пожалуйста, повторите пароль', trigger: 'blur'},
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
    name: 'full_name',
    label: 'ФИО',
    type: 'text',
    placeholder: 'Введите ФИО',
    rules: [
      {required: true, message: 'Пожалуйста, введите ФИО', trigger: 'blur'}
    ]
  },
  {
    name: 'number',
    label: 'Телефон',
    type: 'text',
    placeholder: '+7 (___) ___-__-__',
    rules: [
      {required: true, message: 'Пожалуйста, введите номер телефона', trigger: 'blur'},
      {
        pattern: /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/,
        message: 'Введите корректный номер телефона',
        trigger: 'blur'
      }
    ]
  },
  {
    name: 'vuz',
    label: 'Учебная организация',
    type: 'text',
    placeholder: 'Введите название учебной организации',
    rules: [
      {required: true, message: 'Пожалуйста, введите название учебной организации', trigger: 'blur'}
    ]
  },
  {
    name: 'vuz_direction',
    label: 'Направление',
    type: 'text',
    placeholder: 'Введите направление обучения',
    rules: [
      {required: true, message: 'Пожалуйста, введите направление обучения', trigger: 'blur'}
    ]
  },
  {
    name: 'code_speciality',
    label: 'Код спец.',
    type: 'text',
    placeholder: '__.__.__ ',
    rules: [
      {required: true, message: 'Пожалуйста, введите код специальности', trigger: 'blur'},
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
      {value: '1', label: '1 курс'},
      {value: '2', label: '2 курс'},
      {value: '3', label: '3 курс'},
      {value: '4', label: '4 курс'},
      {value: '5', label: '5 курс'},
      {value: '6', label: '6 курс'},
      {value: '0', label: 'Окончил'}
    ],
    rules: [
      {required: true, message: 'Пожалуйста, выберите курс', trigger: 'change'}
    ]
  },
  {
    name: 'education_certificate_file',
    label: 'Справка с места учёбы/работы',
    type: 'file',
    placeholder: 'Прикрепите справку с места учебы/работы',
    rules: [
      {
        required: true,
        message: 'Пожалуйста, прикрепите справку с места учебы/работы',
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

const mentorFields = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Введите email',
    rules: [
      {required: true, message: 'Пожалуйста, введите почту', trigger: 'blur'},
      {type: 'email', message: 'Почта введена некорректно', trigger: ['blur', 'change']}
    ]
  },
  {
    name: 'password',
    label: 'Пароль',
    type: 'password',
    placeholder: 'Введите пароль',
    rules: [
      {required: true, message: 'Пожалуйста, введите пароль', trigger: 'blur'},
      {min: 6, message: 'Минимум 6 символов', trigger: 'blur'}
    ]
  },
  {
    name: 'confirmPassword',
    label: 'Повторите пароль',
    type: 'password',
    placeholder: 'Повторите пароль',
    rules: [
      {required: true, message: 'Пожалуйста, повторите пароль', trigger: 'blur'},
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
    name: 'full_name',
    label: 'ФИО',
    type: 'text',
    placeholder: 'Введите ФИО',
    rules: [
      {required: true, message: 'Пожалуйста, введите ФИО', trigger: 'blur'}
    ]
  },
  {
    name: 'number',
    label: 'Телефон',
    type: 'text',
    placeholder: '+7 (___) ___-__-__',
    rules: [
      {required: true, message: 'Пожалуйста, введите номер телефона', trigger: 'blur'},
      {
        pattern: /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/,
        message: 'Введите корректный номер телефона',
        trigger: 'blur'
      }
    ]
  },
  {
    name: 'job',
    label: 'Место работы',
    type: 'text',
    placeholder: 'Введите название работы',
    rules: [
      {required: true, message: 'Пожалуйста, введите название работы', trigger: 'blur'}
    ]
  },
  {
    name: 'job_title',
    label: 'Должность',
    type: 'text',
    placeholder: 'Введите должность',
    rules: [
      {required: true, message: 'Пожалуйста, введите должность', trigger: 'blur'}
    ]
  },
  {
    name: 'job_certificate_file',
    label: 'Справка с места работы',
    type: 'file',
    placeholder: 'Прикрепите справку с места работы',
    rules: [
      {
        required: true,
        message: 'Пожалуйста, прикрепите справку с места работы',
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

const currentFields = computed(() => {
  return selectedRole.value === 'participant' ? participantFields : mentorFields;
});

const submitRegistration = async (formData) => {
  try {
    loading.value = true;
    const dataToSend = {
      ...formData,
      role: selectedRole.value
    };
    delete dataToSend.confirmPassword;
    delete dataToSend.terms_accepted;
    await authApi.register(dataToSend);
    registeredEmail.value = formData.email;
    showVerificationModal.value = true;
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

const handleRoleChange = (role) => {
  // Simply change the role - the form will be recreated with new key
  // This completely resets all validation states
  selectedRole.value = role;
  // Clear parent form model
  formModel.value = {};
};
</script>

<style scoped>
.registration-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 64px);
  width: 100%;
  background-color: #f8fafc; /* bg-slate-50 */
  padding: 20px;
  margin-top: 64px; /* Отступ под хедер */
}

.registration-card {
  background: white; /* bg-white */
  width: 100%;
  max-width: 42rem; /* max-w-2xl - шире чем login */
  padding: 32px; /* p-8 */
  border-radius: 12px; /* rounded-xl */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1); /* shadow-lg */
  border: 1px solid #e2e8f0; /* border border-slate-200 */
  max-height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
}

.registration-title {
  font-size: 1.5rem; /* text-2xl */
  font-weight: 700; /* font-bold */
  color: #0f172a; /* text-slate-900 */
  margin: 0 0 24px 0; /* mb-6 */
  text-align: center;
}

/* Segmented Control */
.segmented-control {
  display: flex;
  background: #f1f5f9; /* bg-slate-100 */
  padding: 4px; /* p-1 */
  border-radius: 8px; /* rounded-lg */
  margin-bottom: 24px; /* mb-6 */
  gap: 4px;
}

.segment {
  flex: 1; /* w-1/2 */
  padding: 10px 16px;
  border: none;
  background: transparent;
  color: #64748b; /* text-slate-500 */
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 6px; /* rounded-md */
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.segment:hover {
  color: #475569; /* hover:text-slate-700 */
}

.segment.active {
  background: white; /* bg-white */
  color: #0f172a; /* text-slate-900 */
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
}

.registration-form {
  text-align: left;
  overflow-y: auto;
  flex: 1;
  padding-right: 8px;
}

.registration-form::-webkit-scrollbar {
  width: 8px;
}

.registration-form::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.registration-form::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.registration-form::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Override Element Plus form layout for stacked labels */
.registration-form :deep(.el-form) {
  --el-form-label-width: 0;
}

.registration-form :deep(.el-form-item) {
  margin-bottom: 20px; /* mb-5 - базовый отступ для каждого поля */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  min-height: auto;
}

/* Increase margin when there's an error to prevent overlap */
.registration-form :deep(.el-form-item.is-error) {
  margin-bottom: 28px; /* Больше отступ когда есть ошибка */
  padding-bottom: 8px; /* Дополнительный padding для ошибки */
}

/* Ensure each form item has proper spacing even with errors */
.registration-form :deep(.el-form-item__content) {
  width: 100%;
  margin-left: 0 !important;
  display: flex;
  flex-direction: column;
}

/* Labels above inputs */
.registration-form :deep(.el-form-item__label) {
  display: block;
  font-size: 0.875rem; /* text-sm */
  font-weight: 500; /* font-medium */
  color: #334155; /* text-slate-700 */
  margin-bottom: 6px; /* mb-1.5 */
  padding: 0;
  line-height: 1.5;
  width: 100% !important;
  text-align: left;
  position: relative;
  float: none;
}

.registration-form :deep(.el-form-item__label::before) {
  display: none; /* Убираем красную звездочку */
}

.registration-form :deep(.el-form-item__content) {
  margin-left: 0 !important;
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* Modern input styling - applied to ALL inputs (email, password, confirmPassword, FIO, etc.) */
.registration-form :deep(.el-input__wrapper),
.registration-form :deep(.el-input-number__wrapper),
.registration-form :deep(.el-textarea__inner) {
  width: 100%;
  padding: 8px 12px; /* px-3 py-2 */
  border: 1px solid #cbd5e1; /* border-slate-300 */
  border-radius: 8px; /* rounded-lg */
  transition: all 0.2s ease;
  box-shadow: none;
}

.registration-form :deep(.el-input__wrapper:hover),
.registration-form :deep(.el-input-number__wrapper:hover),
.registration-form :deep(.el-textarea__inner:hover) {
  border-color: #94a3b8; /* hover:border-slate-400 */
}

.registration-form :deep(.el-input.is-focus .el-input__wrapper),
.registration-form :deep(.el-input-number.is-focus .el-input-number__wrapper),
.registration-form :deep(.el-textarea.is-focus .el-textarea__inner) {
  border-color: #2563eb; /* focus:border-blue-500 */
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); /* focus:ring-2 focus:ring-blue-500 */
}

.registration-form :deep(.el-input__inner),
.registration-form :deep(.el-textarea__inner) {
  padding: 0;
  font-size: 0.875rem;
}

/* Select styling - same as inputs */
.registration-form :deep(.el-select .el-input__wrapper) {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  transition: all 0.2s ease;
  box-shadow: none;
}

.registration-form :deep(.el-select:hover .el-input__wrapper) {
  border-color: #94a3b8;
}

.registration-form :deep(.el-select.is-focus .el-input__wrapper) {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

/* File input styling - clean HTML input style */
.registration-form :deep(.file-upload-container) {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* File upload header (tooltip and download template) - fixed alignment */
.registration-form :deep(.file-upload-header) {
  display: flex;
  align-items: center;
  gap: 8px; /* gap-2 */
  margin-bottom: 8px; /* mb-2 */
}

.registration-form :deep(.tooltip-icon) {
  color: #64748b;
  font-size: 16px;
  cursor: help;
  flex-shrink: 0;
}

.registration-form :deep(.download-template-btn) {
  padding: 0;
  font-size: 0.875rem;
  color: #2563eb;
  border: none;
  background: transparent;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: auto;
}

.registration-form :deep(.download-template-btn:hover) {
  color: #1d4ed8;
  text-decoration: underline;
}

.registration-form :deep(.download-template-btn .el-icon) {
  font-size: 14px;
}

/* Standard HTML file input with Tailwind-like styling */
.registration-form :deep(.file-input) {
  display: block;
  width: 100%;
  font-size: 0.875rem; /* text-sm */
  color: #64748b; /* text-slate-500 */
  padding: 0;
  border: none;
  background: transparent;
}

.registration-form :deep(.file-input::file-selector-button) {
  margin-right: 16px; /* file:mr-4 */
  padding: 8px 16px; /* file:py-2 file:px-4 */
  border-radius: 9999px; /* file:rounded-full */
  border: 0; /* file:border-0 */
  font-size: 0.875rem; /* file:text-sm */
  font-weight: 600; /* file:font-semibold */
  background: #eff6ff; /* file:bg-blue-50 */
  color: #1d4ed8; /* file:text-blue-700 */
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.registration-form :deep(.file-input::file-selector-button:hover) {
  background: #dbeafe; /* hover:file:bg-blue-100 */
}

.file-name-display {
  font-size: 0.875rem;
  color: #475569;
  margin-top: 4px;
  padding: 4px 0;
}

.registration-form :deep(.el-form-item__error) {
  position: absolute;
  top: 100%;
  left: 0;
  margin-left: 0;
  margin-top: 4px; /* mt-1 - отступ от инпута */
  color: var(--el-color-danger);
  font-size: 0.75rem;
  line-height: 1.4;
  padding-top: 4px;
  padding-bottom: 4px; /* Добавляем padding снизу для отступа до следующего лейбла */
}

/* Primary button - full width */
.registration-form :deep(.button-container) {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-top: 24px;
  gap: 0;
  position: sticky;
  bottom: 0;
  background: white;
  padding-top: 16px;
  padding-bottom: 8px;
  margin-bottom: 0;
}

.registration-form :deep(.button-confirm) {
  width: 100% !important;
  background: #2563eb; /* bg-blue-600 */
  color: white;
  font-weight: 500; /* font-medium */
  padding: 10px 16px; /* py-2.5 */
  border-radius: 8px; /* rounded-lg */
  border: none;
  transition: background-color 0.2s ease;
}

.registration-form :deep(.button-confirm:hover) {
  background: #1d4ed8; /* hover:bg-blue-700 */
}

.registration-form :deep(.button-confirm:not(:disabled)) {
  background: #2563eb;
}

.registration-form :deep(.button-confirm:not(:disabled):hover) {
  background: #1d4ed8;
}

/* Hide secondary button (we'll use text link instead) */
.registration-form :deep(.button-secondary) {
  display: none;
}

/* Checkbox styling */
.registration-form :deep(.el-checkbox__label) {
  white-space: normal;
  line-height: 1.5;
  font-size: 0.875rem;
}

.registration-form :deep(.el-checkbox) {
  margin-right: 0;
  align-items: flex-start;
}

.registration-form :deep(.el-checkbox__inner) {
  margin-top: 3px;
}

/* Login link section */
.login-link-section {
  text-align: center;
  margin-top: 24px; /* mt-6 */
  font-size: 0.875rem; /* text-sm */
  color: #475569; /* text-slate-600 */
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.login-link-text {
  margin-right: 4px;
}

.login-link-button {
  padding: 0;
  font-size: 0.875rem;
  color: #2563eb; /* text-blue-600 */
  text-decoration: none;
  height: auto;
}

.login-link-button:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .registration-wrapper {
    padding: 16px;
    margin-top: 64px;
  }

  .registration-card {
    padding: 24px;
    max-width: 100%;
    max-height: calc(100vh - 80px);
  }

  .segmented-control {
    margin-bottom: 20px;
  }

  .segment {
    padding: 8px 12px;
    font-size: 0.8125rem;
  }
}
</style>