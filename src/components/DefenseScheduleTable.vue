<template>
  <div v-if="authStore.isAuthenticated" class="defense-schedule">
    <h2>График защиты команд</h2>
    <div class="schedule-info">
      <p>Защиты будут проходить по ссылке: <a href="https://bigbb2.tyuiu.ru/b/hyc-sjb-5lk-prq" target="_blank" class="defense-link">https://bigbb2.tyuiu.ru/b/hyc-sjb-5lk-prq</a></p>
    </div>
    <div class="schedule-table">
      <table>
        <thead>
        <tr>
          <th>Время (МСК)</th>
          <th>Команда</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="team in scheduleData" :key="team.time">
          <td>{{ team.time }}</td>
          <td>{{ team.name }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth.js";

const authStore = useAuthStore();

const scheduleData = [
  { time: "09:00", name: "Двойной удар" },
  { time: "09:15", name: "WattNot" },
  { time: "09:30", name: "Заземленные" },
  { time: "09:45", name: "Команда ЮГУ" },
  { time: "10:00", name: "ЭнергоТек" },
  { time: "10:15", name: "Шнур питания не найден" },
  { time: "10:30", name: "поБЕДА" },
  { time: "10:45", name: "исТок" },
  { time: "11:30", name: "Энергосила" },
  { time: "11:45", name: "МПК ТИУ" },
  { time: "12:00", name: "Шалуны Джоуля" },
  { time: "12:15", name: "Русы" },
];
</script>

<style scoped>
.defense-schedule {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.defense-schedule h2 {
  font-size: 32px;
  margin-bottom: 20px;
  color: #333;
  font-weight: bold;
  text-align: center;
}

.schedule-info {
  text-align: center;
  margin-bottom: 20px;
}

.schedule-info p {
  font-size: 16px;
  color: #333;
}

.defense-link {
  color: #00A3FF;
  text-decoration: none;
  transition: color 0.3s ease;
}

.defense-link:hover {
  color: #5B51D8;
  text-decoration: underline;
}

.schedule-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

th, td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

thead {
  background: linear-gradient(90deg, #00A3FF 0%, #5B51D8 100%);
}

th {
  color: white;
  font-weight: bold;
}

td {
  color: #333;
}

tbody tr:hover {
  background-color: #f5f5f5;
}

@media (max-width: 768px) {
  .defense-schedule {
    padding: 20px 10px;
  }

  .defense-schedule h2 {
    font-size: 24px;
  }

  .schedule-info p {
    font-size: 14px;
  }

  th, td {
    padding: 10px;
  }
}
</style>