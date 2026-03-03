<template>
  <el-form
      :key="formKey"
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
      >
        <template v-if="field.type === 'file'">
          <div class="file-upload-container">
            <div class="file-upload-header" v-if="field.tooltip || field.downloadTemplate">
              <el-tooltip
                  v-if="field.tooltip"
                  :content="field.tooltip"
                  placement="top"
                  effect="light"
                  popper-class="custom-tooltip-popper"
              >
                <el-icon class="tooltip-icon">
                  <InfoFilled/>
                </el-icon>
              </el-tooltip>
              <el-button
                  v-if="field.downloadTemplate"
                  type="primary"
                  link
                  @click="$emit('download-consent')"
                  class="download-template-btn"
              >
                <el-icon>
                  <Download/>
                </el-icon>
                Скачать шаблон
              </el-button>
            </div>
            <input
                type="file"
                :id="`file-input-${field.name}`"
                class="file-input"
                accept="application/pdf"
                @change="(e) => handleFileInputChange(e, field.name)"
            />
            <div v-if="formModel[field.name]" class="file-name-display">
              {{ typeof formModel[field.name] === 'object' && formModel[field.name]?.name ? formModel[field.name].name : 'Файл выбран' }}
            </div>
          </div>
        </template>
        <template v-else-if="field.type === 'checkbox'">
          <el-checkbox
              v-model="formModel[field.name]"
              @change="handleInput"
          >
            <span v-if="field.name === 'terms_accepted'">
              Я ознакомился и согласен с <a href="#" @click.prevent="$emit('download-terms')"
                                            style="color: #409EFF; text-decoration: underline;">условиями проведения хакатона</a>
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
            v-else-if="field.name === 'number'"
            v-model="formModel[field.name]"
            v-mask="'+7 (###) ###-##-##'"
            :mask-placeholder="{ '#': '_' }"
            placeholder="+7 (___) ___-__-__"
            :class="`input-${field.name}`"
            @input="handleInput"
            @keyup.enter="handleSubmit"
        ></el-input>
        <el-input
            v-else-if="field.name === 'code_speciality'"
            v-model="formModel[field.name]"
            :placeholder="field.placeholder || '__.__.__ или _._._'"
            :class="`input-${field.name}`"
            @input="handleSpecialityCodeInput"
            @keyup.enter="handleSubmit"
        ></el-input>
        <el-input
            v-else
            v-model="formModel[field.name]"
            :type="field.type"
            :placeholder="field.placeholder"
            :class="`input-${field.name}`"
            @input="handleInput"
            @keyup.enter="handleSubmit"
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
          v-if="stageStore.isRegistration"
          @click="handleSecondaryAction"
      >
        {{ secondaryButtonText }}
      </el-button>
    </div>
  </el-form>
</template>

<script setup>
import {ref, watch, nextTick} from 'vue';
import {InfoFilled, Download} from '@element-plus/icons-vue';
import {useStageStore} from "@/stores/stage.js";

const stageStore = useStageStore();

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

const emit = defineEmits(['submit', 'secondaryAction', 'update:model-value', 'download-terms', 'download-consent']);
const formModel = ref({});
const rules = ref({});
const fieldErrors = ref({});
const formRef = ref();
const formKey = ref(0);

watch(() => props.fields, (newFields) => {
  const newModel = {};
  const newRules = {};
  const newErrors = {};

  newFields.forEach(field => {
    // Initialize ALL fields as empty
    if (field.type === 'file') {
      newModel[field.name] = null;
    } else if (field.type === 'checkbox') {
      newModel[field.name] = false;
    } else {
      newModel[field.name] = '';
    }
    newErrors[field.name] = '';
    if (field.rules) {
      newRules[field.name] = field.rules;
    }
  });

  // Update model, rules, and errors
  formModel.value = newModel;
  rules.value = newRules;
  fieldErrors.value = newErrors;
  
  // Force form recreation by changing key - this completely resets all validation states
  formKey.value += 1;
}, {immediate: true});

watch(formModel, (newValue) => {
  emit('update:model-value', newValue);
}, {deep: true});
const handleInput = () => {
  emit('update:model-value', formModel.value);
};

const handleSpecialityCodeInput = (value) => {
  // Оставляем только цифры и точки
  const filtered = String(value || '').replace(/[^\d.]/g, '');
  if (formModel.value.code_speciality !== filtered) {
    formModel.value.code_speciality = filtered;
    handleInput();
  }
};

const handleFileChange = (file, fieldName) => {
  formModel.value[fieldName] = file.raw;
  handleInput();
};

const handleFileInputChange = (event, fieldName) => {
  const file = event.target.files?.[0];
  if (file) {
    formModel.value[fieldName] = file;
    handleInput();
    // Trigger validation
    if (formRef.value) {
      formRef.value.validateField(fieldName);
    }
  } else {
    formModel.value[fieldName] = null;
    handleInput();
  }
};

const handleFileRemove = (fieldName) => {
  formModel.value[fieldName] = null;
  // Clear the file input
  const fileInput = document.getElementById(`file-input-${fieldName}`);
  if (fileInput) {
    fileInput.value = '';
  }
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

defineExpose({
  formRef,
  fieldErrors,
  formModel
});
</script>

<style>
.el-popper.custom-tooltip-popper {
  color: #333333 !important;
}
</style>

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

.form-fields-container :deep(.el-checkbox__label a) {
  color: #409EFF;
  text-decoration: underline;
  cursor: pointer;
}

.form-fields-container :deep(.el-checkbox__label a:hover) {
  color: #66b1ff;
}

.file-upload-container {
  width: 100%;
}

.file-upload-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  gap: 12px;
}

.tooltip-icon {
  color: #909399;
  font-size: 16px;
  cursor: help;
}

.download-template-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  height: auto;
  font-size: 14px;
}

.download-template-btn :deep(.el-icon) {
  margin-right: 4px;
}
</style>
