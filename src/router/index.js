import {createRouter, createWebHistory} from 'vue-router'
import HomePage from '../views/HomePage.vue'
import LoginPage from '../views/LoginPage.vue'
import RegistrationPage from "@/views/RegistrationPage.vue";
import {useAuthStore} from "@/stores/auth.js";
import {useLoadingStore} from "@/stores/loading.js";
import TeamApplication from "@/views/TeamApplication.vue";
import MyTeamPage from "@/views/MyTeamPage.vue";

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
            component: TeamApplication,
            meta: {
                requiresAuth: true,
                title: 'Создание команды'
            }
        },
        {
            path: '/team',
            name: 'my-team',
            component: MyTeamPage,
            meta: {
                requiresAuth: true,
                title: 'Moя команда'
            }
        },
        {
            path: '/mentor/teams/:id',
            name: 'MentorTeamView',
            component: () => import('@/views/MyTeamPage.vue'),
            meta: {
                requiresAuth: true,
                roles: ['mentor']
            }
        },
        {
            path: '/mentor/teams',
            name: 'MentorTeams',
            component: () => import('@/views/MentorTeamsPage.vue'),
            meta: {
                requiresAuth: true,
                roles: ['mentor']
            }
        },
    ]
})

router.beforeEach(async (to, from, next) => {
    const loadingStore = useLoadingStore();

    if (loadingStore.isLoading) {
        await new Promise(resolve => {
            const unwatch = loadingStore.$subscribe((mutation, state) => {
                if (!state.isLoading) {
                    unwatch();
                    resolve();
                }
            });
        });
    }

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