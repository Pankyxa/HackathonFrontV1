import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import LoginPage from '../views/LoginPage.vue'
import RegistrationPage from "@/views/RegistrationPage.vue";
import {useAuthStore} from "@/stores/auth.js";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/registration',
      name: 'registration',
      component: RegistrationPage
    },
    {
      path: '/team/apply',
      name: 'TeamApplication',
      component: () => import('@/views/TeamApplication.vue'),
      meta: {
        requiresAuth: true,
        title: 'Создание команды'
      }

    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const isAuthenticated = useAuthStore().isAuthenticated;

    if (!isAuthenticated) {
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router