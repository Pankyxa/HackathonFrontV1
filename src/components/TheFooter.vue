<template>
  <el-footer class="main-header">
    <el-row type="flex" justify="center" :gutter="20">
      <div class="docs-section">
        <h2>Документы</h2>
        <a href="/files/Положение о хакатоне Цифровые двойники в энергетике.pdf"
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
  margin: 5px;
  background: linear-gradient(to right, #0fa4e9, #4338ca);
  border-radius: 20px;
  color: white;
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

@media (max-width: 768px) {
  .el-row {
    flex-direction: column;
    align-items: center;
  }

  .contacts {
    text-align: center;
  }

  .docs-section {
    order: 2;
  }
}
</style>