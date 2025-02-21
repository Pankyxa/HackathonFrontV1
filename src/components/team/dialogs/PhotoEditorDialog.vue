<template>
  <el-dialog
    :modelValue="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
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
        <el-button @click="handleCancel">Отмена</el-button>
        <el-button type="primary" @click="handleSave" class="gradient-button">
          Сохранить
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Cropper, CircleStencil } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  imageUrl: {
    type: String,
    default: null
  }
});

const emit = defineEmits(['update:modelValue', 'save', 'cancel']);

const coordinates = ref(null);
const isMobile = computed(() => window.innerWidth <= 768);

const onChange = (coords) => {
  coordinates.value = coords;
};

const handleSave = async () => {
  if (!coordinates.value) return;

  const { coordinates: coords, canvas } = coordinates.value;

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

  ctx.drawImage(canvas, 0, 0, size, size);

  outputCanvas.toBlob((blob) => {
    const croppedFile = new File([blob], 'team-photo.png', { type: 'image/png' });
    emit('save', croppedFile);
    emit('update:modelValue', false);
  }, 'image/png');
};

const handleCancel = () => {
  emit('cancel');
  emit('update:modelValue', false);
};
</script>

<style scoped>
.cropper-container {
  width: 100%;
  height: 400px;
  background: #000;
}

.cropper {
  height: 100%;
  width: 100%;
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
}
</style>