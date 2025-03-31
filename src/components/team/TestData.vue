<template>
  <div class="task-description">
    <h1 class="task-title">Тестовые данные</h1>
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

.task-description {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.task-title {
  font-size: 2rem;
  color: #333333;
  margin-bottom: 2rem;
  font-weight: 600;
}

.task-content {
  color: #333333;
  line-height: 1.6;
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
  .task-description {
    padding: 1rem;
  }

  .task-title {
    font-size: 1.5rem;
  }
}
</style>

<script setup lang="ts">
</script>