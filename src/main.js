import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import './assets/main.css'
import 'element-plus/dist/index.css'
import axios from 'axios'
import VueTheMask from 'vue-the-mask'
import {ru} from "element-plus/es/locale/index";

// Настраиваем axios interceptor для автоматического добавления токена
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(ElementPlus, {
  locale: ru
})
app.use(VueTheMask)
app.mount('#app')
