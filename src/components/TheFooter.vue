<template>
  <el-footer class="main-header">
    <el-row type="flex" justify="center" :gutter="20">
      <div class="docs-section">
        <h2>Документы</h2>
        <a href="/files/polozhenie.pdf"
           target="_blank"
           class="docs-link">Положение о хакатоне</a>
      </div>
      <div>
        <a href="https://www.tyuiu.ru/">
          <img src="../assets/img/logo_bot.png" alt="">
        </a>
      </div>
      <div class="contacts">
        <h2>Контакты</h2>
        <h3 class="mail">hackathon@tyuiu.ru</h3>
      </div>
    </el-row>
  </el-footer>
</template>

<script lang="ts" setup>
</script>

<style scoped>
.main-header {
  height: auto;
  margin: 0;
  background: linear-gradient(90deg, #1e40af 0%, #1e3a8a 50%, #1e40af 100%); /* Глубокий синий градиент как в Header */
  border-radius: 0;
  color: white;
  width: 100%;
}

div {
  padding: 20px;
}

h2 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  color: white;
  text-align: center;
}

.docs-section {
  text-align: center;
}

.docs-link {
  color: white;
  text-decoration: underline;
  font-size: 14px;
  transition: opacity 0.3s ease;
  display: block;
  margin: 5px 15px;
}

.docs-link:hover {
  opacity: 0.8;
}

.mail {
  font-family: Arial, sans-serif;
  font-size: 14px;
  margin: 5px 15px;
  color: white;
}

.el-row {
  padding-top: 20px;
  padding-bottom: 20px;
}

.img-col {
  margin-top: 10px;
  margin-bottom: 10px;
}

.LK {
  padding: 10px;
}

.logo {
  margin: 0px 15px;
}

img {
  width: 150px;
}

@media (max-width: 767px) {
  .main-header {
    padding: 16px 0; /* py-4 - еще более компактный */
  }

  .el-row {
    flex-direction: column;
    align-items: center;
    gap: 12px; /* gap-3 - уменьшен gap для компактности */
    padding-top: 0;
    padding-bottom: 0;
    text-align: center; /* text-center */
  }

  .contacts {
    text-align: center;
    order: 3;
  }

  .docs-section {
    order: 2;
    text-align: center;
  }

  div {
    padding: 4px 16px; /* Еще более компактный padding */
  }

  h2 {
    font-size: 16px; /* Уменьшен размер заголовка */
    margin-bottom: 4px;
  }

  .docs-link {
    font-size: 12px;
    margin: 2px 8px;
  }

  .mail {
    font-size: 12px;
    margin: 2px 8px;
  }

  img {
    width: 90px; /* Еще более компактный размер логотипа */
  }
}
</style>