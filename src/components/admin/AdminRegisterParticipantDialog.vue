<template>
  <el-dialog
      v-model="dialogVisible"
      title="Регистрация участника"
      class="admin-register-dialog"
      :width="isMobile ? '100%' : '640px'"
      :fullscreen="isMobile"
      destroy-on-close
      append-to-body
      @closed="resetForm"
  >
    <el-alert
        type="info"
        :closable="false"
        show-icon
        class="stage-note"
        title="Текущий этап не изменится. Участник сразу получит подтверждённый статус и сможет войти в систему."
    />

    <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="180px"
        class="register-form"
        label-position="top"
    >
      <div class="documents-block">
        <h3 class="documents-title">Документы</h3>
        <p class="documents-hint">PDF, до 5 МБ. Оба файла обязательны.</p>

        <el-form-item label="Справка" prop="education_certificate_file">
          <el-upload
              action="#"
              :auto-upload="false"
              :show-file-list="false"
              accept="application/pdf"
              :on-change="(file) => handleUploadChange(file, 'education_certificate_file')"
          >
            <el-button type="primary" plain>Прикрепить справку с места учёбы/работы</el-button>
          </el-upload>
          <div v-if="form.education_certificate_file" class="file-name-display">
            {{ form.education_certificate_file.name }}
          </div>
        </el-form-item>

        <el-form-item label="Согласие" prop="consent_file">
          <div class="consent-actions">
            <el-upload
                action="#"
                :auto-upload="false"
                :show-file-list="false"
                accept="application/pdf"
                :on-change="(file) => handleUploadChange(file, 'consent_file')"
            >
              <el-button type="primary" plain>Прикрепить согласие на обработку ПД</el-button>
            </el-upload>
            <el-button type="primary" link @click="downloadConsent">
              Скачать шаблон
            </el-button>
          </div>
          <div v-if="form.consent_file" class="file-name-display">
            {{ form.consent_file.name }}
          </div>
        </el-form-item>
      </div>

      <el-form-item label="Email" prop="email">
        <el-input v-model="form.email" placeholder="email@example.com"/>
      </el-form-item>
      <el-form-item label="Пароль" prop="password">
        <div class="password-row">
          <el-input
              v-model="form.password"
              type="text"
              placeholder="Минимум 6 символов"
          />
          <el-button @click="generatePassword">Сгенерировать</el-button>
        </div>
      </el-form-item>
      <el-form-item label="ФИО" prop="full_name">
        <el-input v-model="form.full_name" placeholder="Фамилия Имя Отчество"/>
      </el-form-item>
      <el-form-item label="Телефон" prop="number">
        <el-input
            v-model="form.number"
            v-mask="'+7 (###) ###-##-##'"
            :mask-placeholder="{ '#': '_' }"
            placeholder="+7 (___) ___-__-__"
        />
      </el-form-item>
      <el-form-item label="Учебная организация" prop="vuz">
        <el-input v-model="form.vuz" placeholder="Название вуза"/>
      </el-form-item>
      <el-form-item label="Направление" prop="vuz_direction">
        <el-input v-model="form.vuz_direction" placeholder="Направление обучения"/>
      </el-form-item>
      <el-form-item label="Код спец." prop="code_speciality">
        <el-input
            v-model="form.code_speciality"
            placeholder="__.__.__ или _._._"
            @input="handleSpecialityCodeInput"
        />
      </el-form-item>
      <el-form-item label="Курс" prop="course">
        <el-select v-model="form.course" placeholder="Выберите курс" style="width: 100%">
          <el-option label="1 курс" value="1"/>
          <el-option label="2 курс" value="2"/>
          <el-option label="3 курс" value="3"/>
          <el-option label="4 курс" value="4"/>
          <el-option label="5 курс" value="5"/>
          <el-option label="6 курс" value="6"/>
          <el-option label="Окончил" value="0"/>
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="dialogVisible = false">Отмена</el-button>
      <el-button type="primary" :loading="submitting" @click="submit">
        Зарегистрировать
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import {computed, reactive, ref} from 'vue'
import {ElMessage, ElMessageBox} from 'element-plus'
import {usersApi} from '@/api/users'

const props = defineProps({
  visible: Boolean
})

const emit = defineEmits(['update:visible', 'registered'])

const formRef = ref(null)
const submitting = ref(false)
const isMobile = ref(window.innerWidth <= 768)

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const emptyForm = () => ({
  email: '',
  password: '',
  full_name: '',
  number: '',
  vuz: '',
  vuz_direction: '',
  code_speciality: '',
  course: '',
  education_certificate_file: null,
  consent_file: null
})

const form = reactive(emptyForm())

const pdfFileRules = (requiredMessage) => ([
  {required: true, message: requiredMessage, trigger: 'change'},
  {
    validator: (rule, value, callback) => {
      if (!value) {
        callback(new Error(requiredMessage))
        return
      }
      if (value.size > 5 * 1024 * 1024) {
        callback(new Error('Размер файла не должен превышать 5MB'))
        return
      }
      if (value.type && value.type !== 'application/pdf') {
        callback(new Error('Допустимые форматы: PDF'))
        return
      }
      callback()
    },
    trigger: 'change'
  }
])

const rules = {
  email: [
    {required: true, message: 'Введите email', trigger: 'blur'},
    {type: 'email', message: 'Некорректный email', trigger: ['blur', 'change']}
  ],
  password: [
    {required: true, message: 'Введите пароль', trigger: 'blur'},
    {min: 6, message: 'Минимум 6 символов', trigger: 'blur'}
  ],
  full_name: [{required: true, message: 'Введите ФИО', trigger: 'blur'}],
  number: [
    {required: true, message: 'Введите номер телефона', trigger: 'blur'},
    {
      pattern: /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/,
      message: 'Введите корректный номер телефона',
      trigger: 'blur'
    }
  ],
  vuz: [{required: true, message: 'Введите учебную организацию', trigger: 'blur'}],
  vuz_direction: [{required: true, message: 'Введите направление', trigger: 'blur'}],
  code_speciality: [
    {required: true, message: 'Введите код специальности', trigger: 'blur'},
    {
      pattern: /^(\d{1,2}\.){2}\d{1,2}$/,
      message: 'Формат: XX.XX.XX или X.X.X (для аспирантов), где X - цифры',
      trigger: 'blur'
    }
  ],
  course: [{required: true, message: 'Выберите курс', trigger: 'change'}],
  education_certificate_file: pdfFileRules('Прикрепите справку с места учебы/работы'),
  consent_file: pdfFileRules('Прикрепите согласие на обработку персональных данных')
}

const generatePassword = () => {
  const chars = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  form.password = Array.from({length: 10}, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

const handleSpecialityCodeInput = (value) => {
  const filtered = String(value || '').replace(/[^\d.]/g, '')
  if (form.code_speciality !== filtered) {
    form.code_speciality = filtered
  }
}

const handleUploadChange = (uploadFile, fieldName) => {
  form[fieldName] = uploadFile?.raw || null
  formRef.value?.validateField(fieldName)
}

const downloadConsent = () => {
  const link = document.createElement('a')
  link.href = '/files/soglasie.pdf'
  link.target = '_blank'
  link.click()
}

const resetForm = () => {
  Object.assign(form, emptyForm())
  formRef.value?.resetFields()
}

const submit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
  } catch {
    return
  }

  submitting.value = true
  try {
    const createdUser = await usersApi.adminRegisterParticipant({...form})
    const credentials = {email: form.email, password: form.password}
    dialogVisible.value = false
    emit('registered', createdUser)
    await ElMessageBox.alert(
        `Email: ${credentials.email}\nПароль: ${credentials.password}\n\nПередайте эти данные участнику. Этап хакатона не изменён.`,
        'Участник зарегистрирован',
        {confirmButtonText: 'Понятно', type: 'success'}
    )
  } catch (error) {
    ElMessage.error(error?.detail || error?.message || 'Не удалось зарегистрировать участника')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.stage-note {
  margin-bottom: 20px;
}

.register-form {
  margin-top: 8px;
}

.password-row {
  display: flex;
  gap: 8px;
  width: 100%;
}

.documents-block {
  margin-top: 8px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;
}

.documents-title {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
}

.documents-hint {
  margin: 0 0 16px;
  font-size: 13px;
  color: #64748b;
}

.consent-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.file-name-display {
  margin-top: 8px;
  font-size: 13px;
  color: #334155;
  word-break: break-all;
}

@media (max-width: 768px) {
  .password-row {
    flex-direction: column;
  }
}
</style>

<style>
.admin-register-dialog.el-dialog {
  max-height: 90vh !important;
  display: flex !important;
  flex-direction: column !important;
  overflow: hidden !important;
}

.admin-register-dialog .el-dialog__body {
  overflow-y: auto !important;
  flex: 1 1 auto !important;
  min-height: 0 !important;
}
</style>
