<template>
  <el-form
      :model="formModel"
      :rules="rules"
      ref="formRef"
      class="auth-form"
      label-width="110px"
      label-position="left"
      @submit.prevent="handleSubmit"
  >
    <div class="form-fields-container">
      <el-form-item
          v-for="field in fields"
          :key="field.name"
          :label="field.label"
          :prop="field.name"
          :error="fieldErrors[field.name]"
      >
        <template v-if="field.type === 'file'">
          <el-upload
              class="upload-field"
              action="#"
              :auto-upload="false"
              :on-change="(file) => handleFileChange(file, field.name)"
              :on-remove="() => handleFileRemove(field.name)"
          >
            <el-button type="primary">Выбрать файл</el-button>
          </el-upload>
        </template>
        <template v-else-if="field.type === 'checkbox'">
          <el-checkbox
              v-model="formModel[field.name]"
              @change="handleInput"
          >
            <!-- Заменяем v-html на компонент с обработчиком клика -->
            <span v-if="field.name === 'terms_accepted'">
              Я ознакомился и согласен с <a href="#" @click.prevent="$emit('download-terms')" style="color: #409EFF; text-decoration: underline;">условиями проведения хакатона</a>
            </span>
            <span v-else v-html="field.customContent"></span>
          </el-checkbox>
        </template>
        <el-select
            v-else-if="field.type === 'select'"
            v-model="formModel[field.name]"
            :placeholder="field.placeholder"
            class="full-width"
        >
          <el-option
              v-for="option in field.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
          />
        </el-select>
        <el-input
            v-else
            v-model="formModel[field.name]"
            :type="field.type"
            :placeholder="field.placeholder"
            :class="`input-${field.name}`"
            @input="handleInput"
        ></el-input>
      </el-form-item>
    </div>
    <div class="button-container">
      <el-button
          class="button-confirm"
          type="primary"
          @click="handleSubmit"
          :loading="loading"
      >
        {{ loading ? submitLoadingText : submitButtonText }}
      </el-button>
      <el-button
          class="button-secondary"
          type="info"
          @click="handleSecondaryAction"
      >
        {{ secondaryButtonText }}
      </el-button>
    </div>
  </el-form>
</template>

<script setup>
import {ref, watch} from 'vue';

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  submitButtonText: {
    type: String,
    required: true
  },
  submitLoadingText: {
    type: String,
    required: true
  },
  secondaryButtonText: {
    type: String,
    required: true
  },
  fields: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['submit', 'secondaryAction', 'update:model-value', 'download-terms']);
const formModel = ref({});
const rules = ref({});
const fieldErrors = ref({});
const formRef = ref();

watch(() => props.fields, (newFields) => {
  const newModel = {};
  const newRules = {};
  const newErrors = {};

  newFields.forEach(field => {
    newModel[field.name] = '';
    newErrors[field.name] = '';
    if (field.rules) {
      newRules[field.name] = field.rules;
    }
  });

  formModel.value = newModel;
  rules.value = newRules;
  fieldErrors.value = newErrors;
}, {immediate: true});

watch(formModel, (newValue) => {
  emit('update:model-value', newValue);
}, {deep: true});
const handleInput = () => {
  emit('update:model-value', formModel.value);
};

const handleFileChange = (file, fieldName) => {
  formModel.value[fieldName] = file.raw;
  handleInput();
};

const handleFileRemove = (fieldName) => {
  formModel.value[fieldName] = null;
  handleInput();
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate((valid, fields) => {
      if (valid) {
        emit('submit', formModel.value);
      } else {
        console.error('Ошибка валидации:', fields);
        // Обновляем ошибки для каждого поля
        Object.keys(fields).forEach(key => {
          fieldErrors.value[key] = fields[key][0].message;
        });
      }
    });
  } catch (error) {
    console.error('Ошибка валидации формы:', error);
  }
};

const handleSecondaryAction = () => {
  emit('secondaryAction');
};
</script>

<style scoped>
.auth-form {
  text-align: left;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.form-fields-container {
  flex: 1;
  overflow-y: auto;
  padding-right: 10px;
}

.form-fields-container :deep(.el-form-item) {
  margin-bottom: 35px;
  position: relative;
}

.form-fields-container :deep(.el-form-item__error) {
  position: absolute;
  top: 100%;
  left: 0;
  padding-top: 4px;
  margin-left: 110px;
}

.form-fields-container::-webkit-scrollbar {
  width: 8px;
}

.form-fields-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.form-fields-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.form-fields-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  gap: 5px;
  background: white;
  padding: 10px 0;
  flex-shrink: 0;
}

.button-container :deep(.el-button) {
  margin: 0 !important;
  width: 200px;
}

.upload-field {
  width: 100%;
}

.upload-field :deep(.el-upload) {
  width: 100%;
}

.upload-field :deep(.el-button) {
  width: 100%;
}

.full-width {
  width: 100%;
}

/* Добавляем стили для чекбокса */
.form-fields-container :deep(.el-checkbox) {
  height: auto;
  margin-right: 0;
}

.form-fields-container :deep(.el-checkbox__label) {
  white-space: normal;
  line-height: 1.4;
}

.form-fields-container :deep(.el-checkbox__input) {
  margin-top: 2px;
}

/* Стили для ссылки внутри чекбокса */
.form-fields-container :deep(.el-checkbox__label a) {
  color: #409EFF;
  text-decoration: underline;
  cursor: pointer;
}

.form-fields-container :deep(.el-checkbox__label a:hover) {
  color: #66b1ff;
}
</style>