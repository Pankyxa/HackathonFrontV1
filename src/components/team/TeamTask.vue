<template>
  <div class="task-description-section">
    <h3 class="card-title">{{ isOnSiteTask ? 'Описание задания очного этапа' : 'Описание задания' }}</h3>

    <div class="task-content">
      <div v-if="isOnSiteTask" class="finalists-only-badge">Только для команд-финалистов</div>

      <!-- Download Section - Attachment Card -->
      <div class="download-attachment-card">
        <el-icon class="file-icon"><Document /></el-icon>
        <div class="file-info">
          <div class="file-name">{{ taskFileName }}</div>
          <div class="file-size">PDF документ</div>
        </div>
        <button @click="downloadTask" class="download-action" :disabled="downloading">
          {{ downloading ? 'Загрузка...' : 'Скачать' }}
        </button>
      </div>
      
      <!-- Task Text Content -->
      <div class="task-prose-wrapper">
        <div class="task-prose">
          <template v-if="isOnSiteTask">
            <div class="task-section">
              <h2>Хакатон «Цифровые двойники в энергетике»</h2>
              <p>
                <strong>Общее описание задания:</strong> Разработка сервиса оценки технического состояния и риска отказа силового трансформатора
              </p>
              <p>
                Силовые трансформаторы напряжением 35 кВ и выше относятся к основному технологическому оборудованию объектов электроэнергетики и являются критическим элементом технологической цепочки производства, передачи и распределения электрической энергии. Отказ трансформатора может приводить к ограничению электроснабжения потребителей, снижению добычи и подготовки продукции, значительным затратам на аварийное восстановление и длительным срокам поставки оборудования.
              </p>
            </div>

            <div class="task-section">
              <h2>Подход к оценке технического состояния</h2>
              <p>
                Современные подходы к управлению активами предполагают переход от планово‑предупредительной модели обслуживания к риску‑ориентированному управлению техническим состоянием. В соответствии с Приказом Минэнерго России №676 (Приложение 1) оценка состояния выполняется на основании результатов испытаний, диагностики, мониторинга, осмотров и эксплуатационной документации.
              </p>
              <p>
                Расчет ИТС выполняется последовательно: оценка параметров, групп параметров, функциональных узлов и оборудования в целом с учетом весовых коэффициентов, критических и ресурсоопределяющих параметров.
              </p>
            </div>

            <div class="task-section">
              <h2>Подход к расчету риска</h2>
              <p>
                Современные подходы к управлению производственными активами предполагают принятие решений о техническом обслуживании, ремонте, реконструкции и замене оборудования не только на основании его текущего технического состояния, но и с учетом вероятности отказа и возможных последствий такого отказа. Такой подход позволяет обеспечить оптимальный баланс между надежностью оборудования, затратами на эксплуатацию и уровнем производственных рисков.
              </p>
              <p>
                В соответствии с Приказом Минэнерго России №123 (Приложение 2) расчет риска отказа выполняется на основании результатов оценки технического состояния оборудования и включает последовательное определение вероятности отказа функциональных узлов, оценку последствий отказа и расчет интегрального показателя риска для оборудования в целом.
              </p>
              <p>
                Результаты расчета риска используются для ранжирования оборудования по приоритетности технических воздействий, формирования программ технического обслуживания и ремонта, обоснования инвестиционных решений и выбора оптимальной стратегии управления жизненным циклом оборудования.
              </p>
            </div>
          </template>

          <template v-else>
          <div class="task-section">
          <p>
            Командам необходимо создать цифровую модель для обеспечения надежного бесперебойного электроснабжения объектов бурения на удаленном месторождении с климатическими условиями, приведенными в Таблице 1 Исходных данных, необходимым качеством генерирующего оборудования и количеством электроэнергии в соответствии с Таблицей 2 (Сведения о буровых установках (Далее-БУ)).
          </p>
          <p>
            Подобрать состав энергокомплекса с учетом обеспечения схемы N+1 и графиком выполнения технического обслуживания дизельных электростанций с периодичностью 250 часов наработки, длительностью до 3 суток.
          </p>
          <p>
            Вариативность (изменение) нагрузки на одной БУ: режим работы электродвигателей буровой установки характеризуется как тяжелый, повторно-кратковременный, с влиянием пусковых процессов. Двигательная нагрузка работает в режимах близких к перегрузкам, со значительными токами. Двигательная нагрузка, а также современная полупроводниковая техника, такая как устройства безударного пуска двигателей и частотно-регулируемые приводы являются значительными источниками реактивной мощности. Для электроснабжения буровой установки предусматривается строительство ВЛ6 кВ от ЗРУ 6 кВ энергокомплекса. ВЛ 6 кВ выполняется проводами типа СИП или АС на металлических опорах из трубы в 127 мм.
          </p>
          <p>
            Основным видом бурения является гидравлическое, то есть с использованием промывочной жидкости (воды с различными компонентами). Сезон бурения круглогодичный, следовательно, в период низких температур требуется осуществлять обогрев резервуаров и трубопроводов с промывочной жидкостью с использованием систем электрообогрева.
          </p>
          <p>
            Стоимость электроэнергии на электростанции для БУ упрощенно определяется расходом топлива, без учета затрат на эксплуатацию.
          </p>
          <p>
            Параллельная работа с сетью не предусматривается.
          </p>
          <p>
            Командам рекомендуется рассмотреть возможность использования оборудования российских производителей.
          </p>
        </div>

        <div class="task-section">
          <h2>Требования к программному продукту:</h2>
          <p>
            Программный продукт должен давать возможность ввода данных нагрузки буровой установки из файла графика нагрузки БУ в формате *.xls или *.xlsx, на основе которого осуществляется моделирование загрузки электрооборудования БУ и электростанции. В состав нагрузки энергокомплекса входит БУ, собственные нужды (СН), временный жилой комплекс (ВЖК).
          </p>
          <p>
            В разрабатываемом программном продукте следует предусмотреть выбор типа БУ и типов ДГУ. Размещение электростанции и БУ на кусте задается генеральным планом объекта, на котором показано расположение энергокомплекса и планируемых к бурению скважин. Бурение скважин производится последовательно путем перемещения БУ эшелонным способом в пределах куста.
          </p>
          <p>
            Для расчета затрат на электроэнергию в программном продукте предусмотреть возможность ввода стоимости топлива.
          </p>
          </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
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
const downloading = ref(false);

const isOnSiteTask = computed(() => stageStore.isOnSiteContentPhase && props.isFinalist);
const taskFileName = computed(() => (
  isOnSiteTask.value ? 'Hackathon_2026_onsite_task.pdf' : 'Hackathon_2026_task.pdf'
));

const downloadTask = async () => {
  downloading.value = true;
  try {
    if (isOnSiteTask.value) {
      await filesApi.downloadStaticFile(taskFileName.value, { onSite: true });
    } else {
      await filesApi.downloadStaticFile(taskFileName.value);
    }
  } catch (error) {
    console.error('Ошибка при скачивании файла:', error);
  } finally {
    downloading.value = false;
  }
};
</script>

<style scoped>
.task-description-section {
  width: 100%;
}

.card-title {
  font-size: 1.25rem; /* text-xl */
  font-weight: 600;
  color: #1e293b; /* text-slate-800 */
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
  max-width: 56rem; /* max-w-4xl - ограничение ширины для читаемости */
  margin: 0 auto;
}

/* Download Attachment Card */
.download-attachment-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #f1f5f9; /* bg-slate-100 */
  border-radius: 8px; /* rounded-lg */
  padding: 16px; /* p-4 */
  margin-bottom: 32px;
  transition: background-color 0.2s ease;
}

.download-attachment-card:hover {
  background: #e2e8f0; /* hover:bg-slate-200 */
}

.file-icon {
  font-size: 32px;
  color: #64748b; /* text-slate-500 */
  flex-shrink: 0;
}

.file-info {
  flex: 1;
  min-width: 0; /* Для правильного обрезания текста */
}

.file-name {
  font-size: 0.875rem; /* text-sm */
  font-weight: 500;
  color: #1e293b; /* text-slate-800 */
  margin-bottom: 4px;
}

.file-size {
  font-size: 0.75rem; /* text-xs */
  color: #64748b; /* text-slate-500 */
}

.download-action {
  padding: 8px 16px;
  background: white;
  color: #2563eb; /* text-blue-600 */
  border: 1px solid #2563eb; /* border-blue-600 */
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem; /* text-sm */
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  white-space: nowrap;
}

.download-action:hover:not(:disabled) {
  background: #eff6ff; /* bg-blue-50 */
}

.download-action:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Typography - Prose-like styling */
.task-prose-wrapper {
  max-width: 56rem; /* max-w-4xl */
  margin: 0 auto;
}

.task-prose {
  color: #334155; /* text-slate-700 */
  line-height: 1.75; /* leading-relaxed */
}

.task-section {
  margin-bottom: 32px; /* space-y-4 между секциями */
}

.task-section:last-child {
  margin-bottom: 0;
}

.task-section h2 {
  font-size: 1.5rem; /* text-2xl */
  color: #1e293b; /* text-slate-800 */
  margin-bottom: 16px;
  margin-top: 0;
  font-weight: 600;
}

.task-section p {
  margin-bottom: 16px; /* space-y-4 между параграфами */
  color: #334155; /* text-slate-700 */
  line-height: 1.75; /* leading-relaxed */
}

.task-section p:last-child {
  margin-bottom: 0;
}

.task-section ul,
.task-section ol {
  padding-left: 1.5rem;
  margin: 16px 0;
  color: #334155; /* text-slate-700 */
}

.task-section li {
  margin-bottom: 8px;
  line-height: 1.75; /* leading-relaxed */
}

@media (max-width: 768px) {
  .task-content {
    max-width: 100%;
  }

  .task-section h2 {
    font-size: 1.25rem; /* text-xl */
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