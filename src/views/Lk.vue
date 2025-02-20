<template>
  <PrimaryLayout>
    <div class="profile-wrapper">
      <div class="profile-container">
        <h2 class="profile-title">Профиль</h2>
        <div class="profile-left">
          <el-avatar
            size="100"
            class="avatar"
            icon="el-icon-user"
            src="https://cdn-icons-png.flaticon.com/512/1057/1057231.png"
          ></el-avatar>
          <el-menu @select="handleSelect">
            <el-menu-item index="1" :class="{ active: activeIndex === '1' }">Основная информация</el-menu-item>
            <el-menu-item index="2" :class="{ active: activeIndex === '2' }">Обучение</el-menu-item>
            <el-menu-item index="3" :class="{ active: activeIndex === '3' }">Безопасность</el-menu-item>
            <el-menu-item index="4" :class="{ active: activeIndex === '4' }">История сеансов</el-menu-item>
          </el-menu>
        </div>

        <div class="profile-right">
          <div class="profile-info">
            <p><strong>Пользователь</strong></p>
            <p>—</p>
            <p><strong>Тип учетной записи</strong></p>
            <p>Студент</p>
            <p><strong>Корпоративный адрес</strong></p>
            <p>—</p>
            <p><strong>Телефон для связи</strong></p>
            <p>—</p>
            <p><strong>Пол</strong></p>
            <p>—</p>
            <p><strong>Дата рождения</strong></p>
            <p>—</p>
            <p><strong>О себе</strong></p>
            <p>—</p>
            <p><strong>Роли</strong></p>
            <el-tag type="info">Студент</el-tag>
          </div>
        </div>
      </div>
    </div>
  </PrimaryLayout>
</template>

<script setup>
import { ref } from 'vue';
import PrimaryLayout from '../layouts/Header-Footer/PrimaryLayout.vue';

const activeIndex = ref('1');

function handleSelect(index) {
  activeIndex.value = index;
}
</script>

<style scoped>
body, html {
  height: 100%;
  margin: 0;
}

.profile-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5faff;
}

.profile-container {
  position: relative; /* Для позиционирования заголовка относительно контейнера */
  display: flex;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 800px;
  height: 600px;
  max-width: 100%;
  max-height: 100%;
}

.profile-title {
  position: absolute;
  top: 20px;
  left: 20px;
  margin: 0;
  font-size: 1.5rem;
}

.profile-left {
  width: 30%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 60px; /* Для отступа под заголовком */
}

.profile-right {
  padding: 20px;
  flex-grow: 1;
  border-left: 1px solid #e0e0e0;
  margin-top: 10px; /* Для отступа под заголовком */
  
}

.avatar {
  margin-bottom: 20px;
}

.el-menu-item {
  padding: 10px;
  margin: 5px 0;
  background-color: #e0e0e0;
  border-radius: 5px;
  transition: background-color 0.3s;
  cursor: pointer;
}

.el-menu-item:hover,
.el-menu-item.active {
  background-color: #007bff;
  color: white;
}

.profile-info {
  color: #333;
}

.profile-info p {
  margin: 5px 0;
}

strong {
  color: #007bff;
  display: block;
  margin-top: 10px;
}

.el-tag {
  margin-top: 10px;
}
</style>
