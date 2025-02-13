<template>
  <div class="photo-editor-container">
    <div v-if="!imageUrl" class="upload-section">
      <el-upload
        class="team-photo-uploader"
        action="#"
        :auto-upload="false"
        :show-file-list="false"
        accept="image/*"
        @change="handlePhotoSelect"
      >
        <div class="upload-trigger">
          <el-icon class="upload-icon"><Plus /></el-icon>
          <div class="upload-text">Нажмите или перетащите фото команды</div>
        </div>
      </el-upload>
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
            aspectRatio: 16/9
          }"
          :default-size="defaultSize"
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
      <div class="preview-container">
        <img :src="croppedImageUrl" alt="Team photo preview" class="preview-image" />
        <div class="preview-actions">
          <el-button type="primary" @click="handleReupload" class="gradient-button">
            Заменить фото
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import { Plus } from '@element-plus/icons-vue';

const props = defineProps({
  modelValue: {
    type: [String, File, null],
    default: null
  }
});

const emit = defineEmits(['update:modelValue']);

const imageUrl = ref(null);
const croppedImageUrl = ref(null);
const showEditor = ref(false);
const coordinates = ref(null);
const cropperRef = ref(null);

const isMobile = computed(() => window.innerWidth <= 768);

const defaultSize = {
  width: 600,
  height: 340
};

const handlePhotoSelect = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    imageUrl.value = e.target.result;
    showEditor.value = true;
  };
  reader.readAsDataURL(file.raw);
};

const onChange = (coords) => {
  coordinates.value = coords;
};

const cropImage = async () => {
  const { coordinates: coords, canvas } = coordinates.value;
  
  canvas.toBlob((blob) => {
    croppedImageUrl.value = URL.createObjectURL(blob);
    const croppedFile = new File([blob], 'team-photo.jpg', { type: 'image/jpeg' });
    emit('update:modelValue', croppedFile);
    showEditor.value = false;
  }, 'image/jpeg', 0.9);
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
};
</script>

<style scoped>
.photo-editor-container {
  width: 100%;
}

.upload-section {
  border: 2px dashed #dcdfe6;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s;
}

.upload-section:hover {
  border-color: #00A3FF;
}

.upload-trigger {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.upload-icon {
  font-size: 32px;
  color: #909399;
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
  margin-top: 20px;
}

.preview-container {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.preview-image {
  width: 100%;
  height: auto;
  display: block;
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

.preview-container:hover .preview-actions {
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

@media (max-width: 768px) {
  .cropper-container {
    height: 300px;
  }

  .preview-actions {
    opacity: 1;
  }
}
</style>