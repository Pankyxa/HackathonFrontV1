<template>
  <div class="test-data-section">
    <h3 class="card-title">Тестовые данные</h3>
    <div class="task-content-wrapper">
      <div class="task-content">
      <div class="task-section download-section">
        <h3>Файлы для скачивания:</h3>
        <div class="download-links">
          <a href="/files/1_Данные_по_потреблению_электроэнергии.xlsx" download class="download-button">
            <span class="download-icon">📥</span>
            Данные по потреблению э/э (.xlsx)
          </a>
          <a href="/files/2_Наработка_ГТЭС.xlsx" download class="download-button">
            <span class="download-icon">📥</span>
            Наработка ГТЭС (.xlsx)
          </a>
          <a href="/files/3_Стоимость_СОГ.xlsx" download class="download-button">
            <span class="download-icon">📥</span>
            Стоимость СОГ (.xlsx)
          </a>
        </div>
      </div>

      <div class="task-section">
        <p>
          В предоставленных файлах содержатся тестовые данные для проверки работы вашей модели:
        </p>
        <ul>
          <li>Данные по потреблению электроэнергии объектами месторождения</li>
          <li>Информация о наработке газотурбинных установок</li>
          <li>Данные по стоимости сухого отбензиненного газа (СОГ)</li>
        </ul>
      </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.download-section {
  background: #f5f9ff;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.download-links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.download-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(90deg, #00A3FF 0%, #5B51D8 100%);
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.download-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.download-icon {
  font-size: 1.2em;
}

.test-data-section {
  width: 100%;
}

.card-title {
  font-size: 1.25rem; /* text-xl */
  font-weight: 600;
  color: #1e293b; /* text-slate-800 */
  margin: 0 0 20px 0;
}

.task-content-wrapper {
  max-width: 56rem; /* max-w-4xl - ограничение ширины для читаемости */
  margin: 0 auto;
  width: 100%;
}

.task-content {
  color: #334155; /* text-slate-700 */
  line-height: 1.75; /* leading-relaxed */
}

.task-section {
  margin: 2rem 0;
}

ul {
  padding-left: 1.5rem;
  margin: 1rem 0;
}

li {
  margin-bottom: 0.5rem;
}

p {
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .task-content-wrapper {
    max-width: 100%;
  }
}
</style>

<script setup lang="ts">
</script>