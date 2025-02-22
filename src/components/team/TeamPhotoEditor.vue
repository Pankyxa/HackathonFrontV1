<template>
  <div class="photo-editor-container">
    <div v-if="!imageUrl" class="upload-section" @click="triggerFileInput">
      <input
          type="file"
          ref="fileInput"
          class="hidden-input"
          accept="image/*"
          @change="handleFileInputChange"
      >
      <div class="upload-trigger">
        <div class="circle-placeholder">
          <el-icon class="upload-icon">
            <Plus/>
          </el-icon>
          <div class="upload-text">Загрузить фото</div>
        </div>
      </div>
    </div>

    <el-dialog
        v-model="showEditor"
        title="Редактирование фото"
        :width="isMobile ? '95%' : '700px'"
        class="editor-dialog"
        :close-on-click-modal="false"
    >
      <div class="cropper-container">
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
          <el-button @click="cancelEdit">Отмена</el-button>
          <el-button type="primary" @click="cropImage" class="gradient-button">
            Сохранить
          </el-button>
        </div>
      </template>
    </el-dialog>

    <div v-if="croppedImageUrl" class="preview-section">
      <div class="circle-preview">
        <img :src="croppedImageUrl" alt="Team photo preview" class="preview-image"/>
        <div class="preview-actions">
          <el-button type="primary" @click="handleReupload" class="gradient-button">
            Изменить
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed} from 'vue';
import {Cropper, CircleStencil} from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import {Plus} from '@element-plus/icons-vue';

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
}

.hidden-input {
  display: none;
}

.circle-placeholder {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 2px dashed #dcdfe6;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: border-color 0.3s;
  background-color: #f8f9fa;
}

.circle-placeholder:hover {
  border-color: #00A3FF;
}

.upload-icon {
  font-size: 32px;
  color: #909399;
  margin-bottom: 8px;
}

.upload-text {
  color: #606266;
  font-size: 14px;
}

.cropper-container {
  width: 100%;
  height: 400px;
  background: #000;
}

.cropper {
  height: 100%;
  width: 100%;
}

.preview-section {
  display: flex;
  justify-content: center;
}

.circle-preview {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-actions {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.circle-preview:hover .preview-actions {
  opacity: 1;
}

.gradient-button {
  background: linear-gradient(90deg, #00A3FF 0%, #5B51D8 100%);
  border: none;
}

.gradient-button:hover {
  opacity: 0.9;
}

:deep(.editor-dialog .el-dialog__body) {
  padding: 0;
}

:deep(.vue-advanced-cropper__background) {
  background-color: rgba(0, 0, 0, 0.5);
}

@media (max-width: 768px) {
  .cropper-container {
    height: 300px;
  }

  .preview-actions {
    opacity: 1;
  }

  .circle-placeholder,
  .circle-preview {
    width: 150px;
    height: 150px;
  }
}
</style>