<template>
  <div
    v-if="showTimer"
    class="countdown-timer"
    :class="{ 'time-ending': isTimeEnding, 'countdown-timer--inline': inline }"
  >
    <span class="timer-label">До окончания загрузки решений:</span>
    <span class="timer-value">{{ formattedTime }}</span>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useStageStore } from '@/stores/stage'

const props = defineProps({
  inline: {
    type: Boolean,
    default: false,
  },
})

const stageStore = useStageStore()
const timeLeft = ref('')
const timer = ref(null)

// Целевая дата: 2 апреля 2026 года 9:30 по московскому времени
const targetDate = new Date('2026-04-02T09:30:00+03:00').getTime()

const showTimer = computed(() => {
  const stageType = stageStore.currentStage?.type

  return (
    stageType === 'remote_task_distribution' ||
    stageType === 'remote_solution_submission'
  )
})

const isTimeEnding = computed(() => {
  const [hours, minutes, seconds] = timeLeft.value.split(':').map(Number)
  return hours === 0 && minutes < 30
})

const updateTimer = () => {
  const now = new Date().getTime()
  const diff = targetDate - now

  if (diff <= 0) {
    timeLeft.value = '00:00:00'
    clearInterval(timer.value)
    return
  }

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  timeLeft.value = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

const formattedTime = computed(() => timeLeft.value)

onMounted(() => {
  updateTimer()
  timer.value = setInterval(updateTimer, 1000)
})

onBeforeUnmount(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})
</script>

<style scoped>
.countdown-timer {
  position: fixed;
  top: 105px;
  right: 20px;
  z-index: 1000;
  background-color: white;
  color: #333;
  text-align: center;
  padding: 10px 15px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  display: flex;
    flex-direction: column;
  align-items: center;
    gap: 4px;
  font-size: 0.9rem;
  min-width: 200px;
}

.countdown-timer--inline {
  position: static;
  top: auto;
  right: auto;
  z-index: auto;
  width: 100%;
  min-width: unset;
}

.timer-label {
  color: #666;
  font-size: 0.8rem;
}

.timer-value {
  font-weight: bold;
  font-family: monospace;
  font-size: 1.1rem;
}

.time-ending {
  background-color: #fff0f0;
  color: #dc3545;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 2px 12px rgba(220, 53, 69, 0.2);
  }
  50% {
    box-shadow: 0 2px 12px rgba(220, 53, 69, 0.5);
  }
  100% {
    box-shadow: 0 2px 12px rgba(220, 53, 69, 0.2);
  }
}

@media (max-width: 768px) {
  .countdown-timer {
    top: 90px; /* Немного уменьшаем отступ на мобильных устройствах */
    right: 10px;
    min-width: 160px;
    font-size: 0.8rem;
  }

  .timer-value {
    font-size: 1rem;
  }
}
</style>
