<template>
  <div class="photo-editor-container">
    <div v-if="!croppedImageUrl" class="upload-section" @click="triggerFileInput">
      <input
          type="file"
          ref="fileInput"
          class="hidden-input"
          accept="image/*"
          @change="handleFileInputChange"
      >
      <div class="upload-area">
        <el-icon class="upload-icon">
          <Plus/>
        </el-icon>
        <div class="upload-text">Загрузить фото команды</div>
        <div class="upload-hint">Нажмите для выбора изображения</div>
      </div>
    </div>

    <el-dialog
        v-model="showEditor"
        title="Редактирование фото"
        :width="isMobile ? '95%' : '800px'"
        class="editor-dialog clean-corporate-modal"
        :close-on-click-modal="false"
    >
      <div class="cropper-wrapper">
        <Cropper
            v-if="imageUrl"
            class="cropper"
            :src="imageUrl"
            :stencil-props="{
              aspectRatio: 1
            }"
            :stencil-component="CircleStencil"
            @change="onChange"
        />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelEdit" class="dialog-secondary-btn">Отмена</el-button>
          <el-button type="primary" @click="cropImage" class="dialog-primary-btn">
            Сохранить
          </el-button>
        </div>
      </template>
    </el-dialog>

    <div v-if="croppedImageUrl" class="preview-section">
      <div class="circle-preview" @click="handleReupload">
        <img :src="croppedImageUrl" alt="Team photo preview" class="preview-image"/>
        <div class="preview-overlay">
          <el-icon class="change-icon"><Edit /></el-icon>
          <span class="change-text">Изменить</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed} from 'vue';
import {Cropper, CircleStencil} from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import {Plus, Edit} from '@element-plus/icons-vue';

const props = defineProps({
  modelValue: {
    type: [String, File, null],
    default: null
  },
  initialImage: {
    type: String,
    default: null
  }
});

const emit = defineEmits(['update:modelValue']);

const fileInput = ref(null);
const imageUrl = ref(null);
const croppedImageUrl = ref(null);
const showEditor = ref(false);
const coordinates = ref(null);

const isMobile = computed(() => window.innerWidth <= 768);

if (props.initialImage) {
  imageUrl.value = props.initialImage
  showEditor.value = true
}

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileInputChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imageUrl.value = e.target.result;
      showEditor.value = true;
    };
    reader.readAsDataURL(file);
  }
  event.target.value = '';
};

const onChange = (coords) => {
  coordinates.value = coords;
};

const cropImage = async () => {
  const {coordinates: coords, canvas} = coordinates.value;

  const outputCanvas = document.createElement('canvas');
  const size = 300;
  outputCanvas.width = size;
  outputCanvas.height = size;
  const ctx = outputCanvas.getContext('2d');

  ctx.clearRect(0, 0, size, size);

  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();

  ctx.drawImage(
      canvas,
      0,
      0,
      size,
      size
  );
  outputCanvas.toBlob((blob) => {
    croppedImageUrl.value = URL.createObjectURL(blob);
    const croppedFile = new File([blob], 'team-photo.png', {type: 'image/png'});
    emit('update:modelValue', croppedFile);
    showEditor.value = false;
  }, 'image/png');
};

const cancelEdit = () => {
  showEditor.value = false;
  if (!croppedImageUrl.value) {
    imageUrl.value = null;
  }
};

const handleReupload = () => {
  imageUrl.value = null;
  croppedImageUrl.value = null;
  emit('update:modelValue', null);
  triggerFileInput();
};
</script>

<style scoped>
.photo-editor-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.upload-section {
  cursor: pointer;
  width: 100%;
}

.hidden-input {
  display: none;
}

/* Modern Dashed Upload Area */
.upload-area {
  width: 100%;
  min-height: 200px;
  border: 2px dashed #cbd5e1; /* border-2 border-dashed border-slate-300 */
  border-radius: 12px; /* rounded-xl */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: white;
  transition: all 0.3s ease;
  gap: 12px;
}

.upload-area:hover {
  border-color: #2563eb; /* hover:border-blue-500 */
  background: #f8fafc; /* hover:bg-slate-50 */
}

.upload-icon {
  font-size: 48px;
  color: #94a3b8; /* text-slate-400 */
  margin-bottom: 8px;
}

.upload-text {
  color: #1e293b; /* text-slate-800 */
  font-size: 16px;
  font-weight: 500;
  text-align: center;
}

.upload-hint {
  color: #64748b; /* text-slate-500 */
  font-size: 14px;
  text-align: center;
}

/* Cropper Modal - Fixed Height Structure */
.cropper-wrapper {
  width: 100%;
  height: 500px;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
}

.cropper {
  width: 100%;
  height: 100%;
}

/* Dialog Footer */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.dialog-primary-btn {
  background: #2563eb; /* bg-blue-600 */
  color: white;
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.dialog-primary-btn:hover {
  background: #1d4ed8; /* hover:bg-blue-700 */
}

.dialog-secondary-btn {
  background: transparent;
  color: #475569; /* text-slate-600 */
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  font-weight: 500;
  transition: all 0.2s ease;
}

.dialog-secondary-btn:hover {
  background: #f1f5f9; /* hover:bg-slate-100 */
  border-color: #cbd5e1;
}

/* Preview Section */
.preview-section {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.circle-preview {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 3px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.circle-preview:hover {
  border-color: #2563eb;
  box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.2), 0 4px 6px -4px rgba(37, 99, 235, 0.1);
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 50%;
}

.circle-preview:hover .preview-overlay {
  opacity: 1;
}

.change-icon {
  color: white;
  font-size: 24px;
}

.change-text {
  color: white;
  font-size: 14px;
  font-weight: 500;
}

:deep(.editor-dialog .el-dialog__body) {
  padding: 24px;
  overflow: hidden; /* Убираем лишний padding который может ломать layout */
}

:deep(.vue-advanced-cropper__background) {
  background-color: rgba(0, 0, 0, 0.5);
}

@media (max-width: 768px) {
  .upload-area {
    min-height: 150px;
    padding: 30px 16px;
  }

  .upload-icon {
    font-size: 36px;
  }

  .upload-text {
    font-size: 14px;
  }

  .upload-hint {
    font-size: 12px;
  }

  .cropper-wrapper {
    height: 300px; /* Меньше на мобильных */
  }

  .circle-preview {
    width: 150px;
    height: 150px;
  }
}
</style>
