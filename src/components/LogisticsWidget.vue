<template>
  <section class="logistics-section">
    <el-card class="logistics-card" shadow="never">
      <template #header>
        <div class="logistics-header">
          <el-icon class="header-icon" :size="22">
            <Location />
          </el-icon>
          <h2>Как добраться (Памятка для финалистов)</h2>
        </div>
      </template>

      <el-tabs v-model="activeTab" class="logistics-tabs">
        <el-tab-pane label="✈️ Аэропорт → Общежитие" name="route1" lazy>
          <el-row :gutter="20" class="route-row">
            <el-col :span="12" :xs="24">
              <div class="route-info">
                <h3 class="route-title">Аэропорт Рощино ➔ ул. Котовского, 54а</h3>
                <p class="route-subtitle">Международный аэропорт Рощино → общежитие №15 ТИУ</p>

                <el-card class="method-card" shadow="hover">
                  <div class="method-body">
                    <div class="method-icon taxi">
                      <el-icon :size="22"><Van /></el-icon>
                    </div>
                    <div class="method-content">
                      <div class="method-top">
                        <h4>На такси</h4>
                        <div class="method-tags">
                          <el-tag type="info" size="small" effect="light">~25–35 мин</el-tag>
                          <el-tag type="success" size="small" effect="light">~500–800 ₽</el-tag>
                        </div>
                      </div>
                      <p>Яндекс Go / Максим. Время: ~25–35 мин. Стоимость: ~500–800 руб.</p>
                    </div>
                  </div>
                </el-card>

                <el-card class="method-card" shadow="hover">
                  <div class="method-body">
                    <div class="method-icon bus">
                      <el-icon :size="22"><Ticket /></el-icon>
                    </div>
                    <div class="method-content">
                      <div class="method-top">
                        <h4>На автобусе</h4>
                        <div class="method-tags">
                          <el-tag type="info" size="small" effect="light">Экспресс №10</el-tag>
                          <el-tag type="warning" size="small" effect="light">+10–15 мин пешком</el-tag>
                        </div>
                      </div>
                      <p>Экспресс №10 до остановки «Ул. Холодильная», далее 10–15 минут пешком.</p>
                    </div>
                  </div>
                </el-card>
              </div>
            </el-col>

            <el-col :span="12" :xs="24">
              <div class="map-wrap">
                <div v-if="activeTab === 'route1'" class="map-frame">
                  <iframe
                    src="https://yandex.ru/map-widget/v1/?ll=65.463466%2C57.161083&z=11&l=map&rtext=57.181892%2C65.349576~57.140274%2C65.577557&rtt=auto"
                    width="100%"
                    height="400"
                    frameborder="0"
                    allowfullscreen
                    loading="lazy"
                    title="Маршрут из аэропорта Рощино до общежития"
                    style="border-radius: 12px; border: 1px solid #ebeef5;"
                  ></iframe>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="🏢 Общежитие → Финал" name="route2" lazy>
          <el-row :gutter="20" class="route-row">
            <el-col :span="12" :xs="24">
              <div class="route-info">
                <h3 class="route-title">ул. Котовского, 54а ➔ ул. Орджоникидзе, 54 (ТИУ)</h3>
                <p class="route-subtitle">Общежитие №15 → учебно-лабораторный корпус №1А</p>

                <el-card class="method-card" shadow="hover">
                  <div class="method-body">
                    <div class="method-icon walk">
                      <el-icon :size="22"><Guide /></el-icon>
                    </div>
                    <div class="method-content">
                      <div class="method-top">
                        <h4>Пешком</h4>
                        <div class="method-tags">
                          <el-tag type="info" size="small" effect="light">~20–25 мин</el-tag>
                          <el-tag type="success" size="small" effect="light">1.5–2 км</el-tag>
                        </div>
                      </div>
                      <p>~20–25 минут (1.5–2 км) по центру города.</p>
                    </div>
                  </div>
                </el-card>

                <el-card class="method-card" shadow="hover">
                  <div class="method-body">
                    <div class="method-icon bus">
                      <el-icon :size="22"><Ticket /></el-icon>
                    </div>
                    <div class="method-content">
                      <div class="method-top">
                        <h4>На автобусе</h4>
                        <div class="method-tags">
                          <el-tag type="info" size="small" effect="light">11, 14, 17, 30</el-tag>
                          <el-tag type="warning" size="small" effect="light">+3–5 мин пешком</el-tag>
                        </div>
                      </div>
                      <p>От ост. «Ул. Холодильная» до ост. «Сквер Немцова» (маршруты 11, 14, 17, 30), далее 3–5 минут пешком.</p>
                    </div>
                  </div>
                </el-card>

                <el-card class="method-card" shadow="hover">
                  <div class="method-body">
                    <div class="method-icon taxi">
                      <el-icon :size="22"><Van /></el-icon>
                    </div>
                    <div class="method-content">
                      <div class="method-top">
                        <h4>На такси</h4>
                        <div class="method-tags">
                          <el-tag type="info" size="small" effect="light">5–7 мин</el-tag>
                          <el-tag type="success" size="small" effect="light">~150–250 ₽</el-tag>
                        </div>
                      </div>
                      <p>5–7 минут, ~150–250 руб.</p>
                    </div>
                  </div>
                </el-card>
              </div>
            </el-col>

            <el-col :span="12" :xs="24">
              <div class="map-wrap">
                <div v-if="activeTab === 'route2'" class="map-frame">
                  <iframe
                    src="https://yandex.ru/map-widget/v1/?ll=65.561467%2C57.146014&z=14&l=map&rtext=57.140274%2C65.577557~57.151754%2C65.545377&rtt=pd"
                    width="100%"
                    height="400"
                    frameborder="0"
                    allowfullscreen
                    loading="lazy"
                    title="Маршрут от общежития до места финала"
                    style="border-radius: 12px; border: 1px solid #ebeef5;"
                  ></iframe>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { Van, Location, Guide, Ticket } from '@element-plus/icons-vue'

const activeTab = ref('route1')
</script>

<style scoped>
.logistics-section {
  padding: 48px 20px;
  width: 100%;
}

.logistics-card {
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.logistics-card :deep(.el-card__header) {
  padding: 20px 24px;
  border-bottom: 1px solid #ebeef5;
  background: linear-gradient(90deg, rgba(0, 163, 255, 0.06) 0%, rgba(91, 81, 216, 0.06) 100%);
}

.logistics-card :deep(.el-card__body) {
  padding: 8px 24px 24px;
}

.logistics-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logistics-header h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: #111827;
  line-height: 1.3;
}

.header-icon {
  color: #2563eb;
  flex-shrink: 0;
}

.logistics-tabs :deep(.el-tabs__header) {
  margin-bottom: 20px;
}

.logistics-tabs :deep(.el-tabs__item) {
  font-weight: 500;
  font-size: 15px;
}

.logistics-tabs :deep(.el-tabs__item.is-active) {
  color: #2563eb;
  font-weight: 600;
}

.logistics-tabs :deep(.el-tabs__active-indicator),
.logistics-tabs :deep(.el-tabs__active-bar) {
  background-color: #2563eb;
}

.route-row {
  align-items: stretch;
}

.route-row :deep(.el-col) {
  display: flex;
  flex-direction: column;
}

.route-info {
  width: 100%;
}

.route-title {
  margin: 0 0 6px;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  line-height: 1.35;
}

.route-subtitle {
  margin: 0 0 16px;
  font-size: 13px;
  color: #6b7280;
}

.method-card {
  margin-bottom: 12px;
  border-radius: 12px;
  border: 1px solid #ebeef5;
}

.method-card :deep(.el-card__body) {
  padding: 14px 16px;
}

.method-body {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.method-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.method-icon.taxi {
  background: #eff6ff;
  color: #2563eb;
}

.method-icon.bus {
  background: #f5f3ff;
  color: #5b51d8;
}

.method-icon.walk {
  background: #ecfdf5;
  color: #059669;
}

.method-content {
  min-width: 0;
  flex: 1;
}

.method-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 6px;
}

.method-content h4 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #111827;
}

.method-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.method-content p {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: #4b5563;
}

.map-wrap {
  width: 100%;
  flex: 1;
  min-height: 400px;
  border-radius: 12px;
  overflow: hidden;
  background: #f8fafc;
}

.map-wrap iframe,
.map-frame {
  display: block;
  width: 100%;
  min-height: 400px;
  height: 100%;
  border: 0;
}

@media (max-width: 767px) {
  .logistics-section {
    padding: 30px 20px;
  }

  .logistics-card {
    border-radius: 12px;
  }

  .logistics-card :deep(.el-card__header) {
    padding: 16px;
  }

  .logistics-card :deep(.el-card__body) {
    padding: 4px 16px 16px;
  }

  .logistics-header h2 {
    font-size: 18px;
  }

  .logistics-tabs :deep(.el-tabs__item) {
    font-size: 13px;
    padding: 0 12px;
  }

  .route-row :deep(.el-col) + .el-col {
    margin-top: 20px;
  }

  .route-title {
    font-size: 16px;
  }

  .map-wrap {
    height: 280px;
  }

  .map-wrap iframe {
    height: 280px;
  }
}
</style>
