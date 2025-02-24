<template>
    <button @click="displayUsers">g</button>
    <div id="usersContainer"></div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted } from 'vue';
  import { Search } from '@element-plus/icons-vue';
  import { usersApi } from '@/api/users.js';
  import { ElMessage } from 'element-plus';
  

   async function displayUsers(query, role) {
     try {
       // Получаем пользователей
       const users = await usersApi.searchUsers(query, role);
       
       // Находим контейнер для пользователей
       const usersContainer = document.getElementById('usersContainer');
       usersContainer.innerHTML = ''; // Очищаем содержимое перед добавлением новых данных
       
       // Проходимся по каждому пользователю и добавляем его в контейнер
       users.forEach(user => {
         const userDiv = document.createElement('div');
         userDiv.classList.add('user');
         userDiv.innerHTML = `
           <h3>${user.name}</h3>
           <p>Email: ${user.email}</p>
           <p>Username: ${user.username}</p>
         `;
         usersContainer.appendChild(userDiv);
       });
     } catch (error) {
       console.error('Ошибка при получении пользователей:', error);
     }
   }

   // Вызов функции для отображения
   displayUsers('yourQueryHere', 'member');
   
  </script>
  
  <style scoped>
  .user {
     border: 1px solid #ccc;
     padding: 10px;
     margin: 10px 0;
     border-radius: 5px;
     box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
   }
  </style>