<template>
  <div class="test-data-section">
    <h3 class="card-title">{{ isOnSiteData ? 'Тестовые данные очного этапа' : 'Тестовые данные' }}</h3>
    
    <div class="task-content">
      <div v-if="isOnSiteData" class="finalists-only-badge">Только для команд-финалистов</div>

      <!-- File Cards -->
      <div class="files-list">
        <div class="download-attachment-card" v-for="(file, index) in currentFiles" :key="index">
          <el-icon class="file-icon"><Document /></el-icon>
          <div class="file-info">
            <div class="file-name">{{ file.name }}</div>
            <div class="file-type">{{ file.type }}</div>
          </div>
          <button
            v-if="file.onSite"
            type="button"
            class="download-action"
            :disabled="downloadingFile === file.filename"
            @click="downloadOnSiteFile(file.filename)"
          >
            {{ downloadingFile === file.filename ? 'Загрузка...' : 'Скачать' }}
          </button>
          <a v-else :href="file.url" download class="download-action">
            Скачать
          </a>
        </div>
      </div>

      <div class="task-section">
        <p v-if="isOnSiteData">
          В предоставленных файлах содержатся полный текст задания очного этапа и приложения к нему:
        </p>
        <ul v-if="isOnSiteData">
          <li><strong>Текст задания второго тура</strong> — полное описание задания очного этапа</li>
          <li><strong>Приложение 1</strong> — приказ Минэнерго №676 по оценке технического состояния основного электрооборудования и сетей</li>
          <li><strong>Приложение 2</strong> — приказ Минэнерго №123 по расчёту вероятности отказа и оценке последствий</li>
          <li><strong>Приложение 3</strong> — паспортные данные силового трансформатора</li>
          <li><strong>Приложение 4</strong> — схема подстанции 35/6 кВ с присоединениями</li>
        </ul>
        <template v-else>
        <p>
          В предоставленных файлах содержатся тестовые данные для работы над проектом:
        </p>
        <ul>
          <li><strong>Нагрузка БУ6000</strong> — данные по электрическим нагрузкам объектов месторождения</li>
          <li><strong>Проект генплана</strong> — генеральный план месторождения в формате AutoCAD</li>
          <li><strong>Стоимость топлива</strong> — данные по стоимости топливных ресурсов</li>
          <li><strong>Требования к оформлению презентации</strong> — шаблон и требования для подготовки защиты проекта</li>
        </ul>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { Document } from '@element-plus/icons-vue';
import { filesApi } from '@/api/files';
import { useStageStore } from '@/stores/stage.js';

const props = defineProps({
  isFinalist: {
    type: Boolean,
    default: false
  }
});

const stageStore = useStageStore();
const downloadingFile = ref('');

const isOnSiteData = computed(() => stageStore.isOnSiteContentPhase && props.isFinalist);

const remoteFiles = [
  {
    name: 'Нагрузка_БУ6000.xlsx',
    type: 'Excel документ',
    url: '/files/Нагрузка_БУ6000.xlsx'
  },
  {
    name: 'Проект_генплана.dwg',
    type: 'AutoCAD файл',
    url: '/files/Проект_генплана.dwg'
  },
  {
    name: 'Стоимость_топлива.xlsx',
    type: 'Excel документ',
    url: '/files/Стоимость_топлива.xlsx'
  },
  {
    name: 'Требования_к_оформлению_презентации_Хакатона.pptx',
    type: 'PowerPoint документ',
    url: '/files/Требования_к_оформлению_презентации_Хакатона.pptx'
  }
];

const onSiteFiles = [
  {
    name: 'Текст_задания_второго_тура.pdf',
    filename: 'Hackathon_2026_onsite_task_full.pdf',
    type: 'PDF документ',
    onSite: true
  },
  {
    name: 'Приложение_1_Приказ_Минэнерго_676.pdf',
    filename: 'Prilozhenie_1_Prikaz_Minenergo_676.pdf',
    type: 'PDF документ',
    onSite: true
  },
  {
    name: 'Приложение_2_Приказ_Минэнерго_123.pdf',
    filename: 'Prilozhenie_2_Prikaz_Minenergo_123.pdf',
    type: 'PDF документ',
    onSite: true
  },
  {
    name: 'Приложение_3_Паспорт_трансформатора.pdf',
    filename: 'Prilozhenie_3_Pasport_transformatora.pdf',
    type: 'PDF документ',
    onSite: true
  },
  {
    name: 'Приложение_4_Схема_ПС_35_6кВ.pdf',
    filename: 'Prilozhenie_4_Schema_PS_35_6kV.pdf',
    type: 'PDF документ',
    onSite: true
  }
];

const currentFiles = computed(() => isOnSiteData.value ? onSiteFiles : remoteFiles);

const downloadOnSiteFile = async (filename) => {
  downloadingFile.value = filename;
  try {
    await filesApi.downloadStaticFile(filename, { onSite: true });
  } catch (error) {
    console.error('Ошибка при скачивании файла:', error);
  } finally {
    downloadingFile.value = '';
  }
};
</script>

<style scoped>
.test-data-section {
  width: 100%;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 20px 0;
}

.finalists-only-badge {
  display: inline-flex;
  align-items: center;
  margin-bottom: 16px;
  padding: 6px 12px;
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.task-content {
  width: 100%;
  max-width: 56rem;
  margin: 0 auto;
}

.files-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
}

/* Download Attachment Card - стиль как в TeamTask.vue */
.download-attachment-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #f1f5f9;
  border-radius: 8px;
  padding: 16px;
  transition: background-color 0.2s ease;
}

.download-attachment-card:hover {
  background: #e2e8f0;
}

.file-icon {
  font-size: 32px;
  color: #64748b;
  flex-shrink: 0;
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 4px;
  word-break: break-all;
}

.file-type {
  font-size: 0.75rem;
  color: #64748b;
}

.download-action {
  padding: 8px 16px;
  background: white;
  color: #2563eb;
  border: 1px solid #2563eb;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  white-space: nowrap;
  text-decoration: none;
  display: inline-block;
}

.download-action:hover {
  background: #eff6ff;
}

.download-action:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.task-section {
  margin-bottom: 32px;
}

.task-section p {
  margin-bottom: 16px;
  color: #334155;
  line-height: 1.75;
}

.task-section ul {
  padding-left: 1.5rem;
  margin: 16px 0;
  color: #334155;
}

.task-section li {
  margin-bottom: 8px;
  line-height: 1.75;
}

@media (max-width: 768px) {
  .task-content {
    max-width: 100%;
  }
  
  .download-attachment-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .download-action {
    width: 100%;
    text-align: center;
  }
}
</style>
