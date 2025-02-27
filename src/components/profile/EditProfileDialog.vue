<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Редактирование профиля</h3>
        <button class="close-button" @click="$emit('close')">&times;</button>
      </div>

      <div class="modal-body">
        <el-form
            ref="formRef"
            :model="editableData"
            :rules="formRules"
            label-position="left"
        >
          <div class="form-grid">
            <el-form-item label="ФИО:" prop="full_name">
              <el-input
                  v-model="editableData.full_name"
                  placeholder="Введите ФИО"
              />
            </el-form-item>

            <el-form-item label="Email:" prop="email">
              <el-input
                  v-model="editableData.email"
                  readonly
                  disabled
              />
            </el-form-item>

            <template v-if="hasParticipantRole">
              <el-form-item label="Номер телефона:" prop="participant_info.number">
                <el-input
                    v-model="editableData.participant_info.number"
                    placeholder="+7 (___) ___-__-__"
                    v-mask="{ mask: '+7 (###) ###-##-##', tokens: { '#': { pattern: /\d/ }, '_': { pattern: /\d/, default: '_' } } }"
                />
              </el-form-item>

              <el-form-item label="ВУЗ:" prop="participant_info.vuz">
                <el-input
                    v-model="editableData.participant_info.vuz"
                    placeholder="Введите название учебной организации"
                />
              </el-form-item>

              <el-form-item label="Направление:" prop="participant_info.vuz_direction">
                <el-input
                    v-model="editableData.participant_info.vuz_direction"
                    placeholder="Введите направление обучения"
                />
              </el-form-item>

              <el-form-item label="Специальность:" prop="participant_info.code_speciality">
                <el-input
                    v-model="editableData.participant_info.code_speciality"
                    placeholder="__.__.__ "
                    v-mask="{ mask: '##.##.##', tokens: { '#': { pattern: /\d/ }, '_': { pattern: /\d/, default: '_' } } }"
                />
              </el-form-item>

              <el-form-item label="Курс:" prop="participant_info.course">
                <el-select
                    v-model="editableData.participant_info.course"
                    placeholder="Выберите курс"
                >
                  <el-option
                      v-for="option in courseOptions"
                      :key="option.value"
                      :label="option.label"
                      :value="option.value"
                  />
                </el-select>
              </el-form-item>
            </template>

            <template v-if="hasMentorRole">
              <el-form-item label="Номер телефона:" prop="mentor_info.number">
                <el-input
                    v-model="editableData.mentor_info.number"
                    placeholder="+7 (___) ___-__-__"
                    v-mask="{ mask: '+7 (###) ###-##-##', tokens: { '#': { pattern: /\d/ }, '_': { pattern: /\d/, default: '_' } } }"
                />
              </el-form-item>

              <el-form-item label="Место работы:" prop="mentor_info.job">
                <el-input
                    v-model="editableData.mentor_info.job"
                    placeholder="Введите название работы"
                />
              </el-form-item>

              <el-form-item label="Должность:" prop="mentor_info.job_title">
                <el-input
                    v-model="editableData.mentor_info.job_title"
                    placeholder="Введите должность"
                />
              </el-form-item>
            </template>
          </div>
        </el-form>
      </div>

      <div class="modal-footer">
        <button class="btn-cancel" @click="$emit('close')">Отмена</button>
        <button class="btn-save" @click="submitForm">Сохранить</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed} from 'vue'
import {usersApi} from '@/api/users'
import {ElMessage} from 'element-plus'
import {mask} from 'vue-the-mask'

const props = defineProps({
  userData: {
    type: Object,
    required: true
  }
})

const directives = {
  mask
}

const emit = defineEmits(['close', 'update'])
const formRef = ref(null)
const editableData = ref(JSON.parse(JSON.stringify(props.userData)))

const hasParticipantRole = computed(() => {
  return props.userData?.roles?.some(role => role.name === 'participant')
})

const hasMentorRole = computed(() => {
  return props.userData?.roles?.some(role => role.name === 'mentor')
})

const courseOptions = [
  {value: '1', label: '1 курс'},
  {value: '2', label: '2 курс'},
  {value: '3', label: '3 курс'},
  {value: '4', label: '4 курс'},
  {value: '5', label: '5 курс'},
  {value: '6', label: '6 курс'},
  {value: '0', label: 'Окончил'}
]

const formRules = {
  full_name: [
    {required: true, message: 'Пожалуйста, введите ФИО', trigger: 'blur'}
  ],
  'participant_info.number': [
    {required: true, message: 'Пожалуйста, введите номер телефона', trigger: 'blur'},
    {
      pattern: /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/,
      message: 'Введите корректный номер телефона',
      trigger: 'blur'
    }
  ],
  'participant_info.vuz': [
    {required: true, message: 'Пожалуйста, введите название учебной организации', trigger: 'blur'}
  ],
  'participant_info.vuz_direction': [
    {required: true, message: 'Пожалуйста, введите направление обучения', trigger: 'blur'}
  ],
  'participant_info.code_speciality': [
    {required: true, message: 'Пожалуйста, введите код специальности', trigger: 'blur'},
    {
      pattern: /^\d{2}\.\d{2}\.\d{2}$/,
      message: 'Формат: XX.XX.XX, где X - цифры',
      trigger: 'blur'
    }
  ],
  'participant_info.course': [
    {required: true, message: 'Пожалуйста, выберите курс', trigger: 'change'}
  ],
  'mentor_info.number': [
    {required: true, message: 'Пожалуйста, введите номер телефона', trigger: 'blur'},
    {
      pattern: /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/,
      message: 'Введите корректный номер телефона',
      trigger: 'blur'
    }
  ],
  'mentor_info.job': [
    {required: true, message: 'Пожалуйста, введите название работы', trigger: 'blur'}
  ],
  'mentor_info.job_title': [
    {required: true, message: 'Пожалуйста, введите должность', trigger: 'blur'}
  ]
}

const submitForm = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    await usersApi.updateCurrentUser(editableData.value)
    emit('update', editableData.value)
    ElMessage.success('Данные успешно обновлены')
  } catch (error) {
    if (error.fields) {
      ElMessage.error('Пожалуйста, проверьте правильность заполнения полей')
    } else {
      console.error('Error updating user data:', error)
      ElMessage.error('Ошибка при обновлении данных')
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 16px 24px;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  color: var(--color-heading);
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #606266;
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-save,
.btn-cancel {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-save {
  background: #67C23A;
  color: white;
}

.btn-save:hover {
  background: #85ce61;
}

.btn-cancel {
  background: #909399;
  color: white;
}

.btn-cancel:hover {
  background: #a6a9ad;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-input.is-disabled .el-input__inner) {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .modal-footer {
    flex-direction: column-reverse;
  }

  .btn-save,
  .btn-cancel {
    width: 100%;
  }
}
</style>