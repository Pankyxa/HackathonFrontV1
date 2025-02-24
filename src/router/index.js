import {createRouter, createWebHistory} from 'vue-router'
import HomePage from '../views/HomePage.vue'
import LoginPage from '../views/LoginPage.vue'
import RegistrationPage from "@/views/RegistrationPage.vue";
import {useAuthStore} from "@/stores/auth.js";
import {useLoadingStore} from "@/stores/loading.js";
import TeamApplication from "@/views/TeamApplication.vue";
import MyTeamPage from "@/views/MyTeamPage.vue";
import SpecialRegistrationPage from "@/views/SpecialRegistrationPage.vue";
import OrganizerPage from "@/views/OrganizerPage.vue";
import MentorTeamsPage from "@/views/MentorTeamsPage.vue";
import AdminPage from "@/views/AdminPage.vue";
import ProfilePage from "@/views/ProfilePage.vue";

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
            path: '/register/special',
            name: 'SpecialRegistration',
            component: SpecialRegistrationPage,
            meta: {
                requiresAuth: false,
                hideNavigation: true
            }
        },
        {
            path: '/team/apply',
            name: 'TeamApplication',
            component: TeamApplication,
            meta: {
                requiresAuth: true,
                requiresMember: true,
                title: 'Создание команды'
            }
        },
        {
            path: '/team',
            name: 'my-team',
            component: MyTeamPage,
            meta: {
                requiresAuth: true,
                requiresMember: true,
                title: 'Moя команда'
            }
        },
        {
            path: '/mentor/teams/:id',
            name: 'MentorTeamView',
            component: MyTeamPage,
            meta: {
                requiresAuth: true,
                requiresMentor: true
            }
        },
        {
            path: '/mentor/teams',
            name: 'MentorTeams',
            component: MentorTeamsPage,
            meta: {
                requiresAuth: true,
                requiresMentor: true
            }
        },
        {
            path: '/organizer',
            name: 'organizer',
            component: OrganizerPage,
            meta: {
                requiresAuth: true,
                requiresOrganizer: true
            }
        },
        {
            path: '/admin',
            name: 'admin',
            component: AdminPage,
            meta: {
                requiresAuth: true,
                requiresAdmin: true
            }
        },
        {
            path: '/profile',
            name: 'profile',
            component: ProfilePage,
            meta: { requiresAuth: true }
        }
    ]
})

router.beforeEach(async (to, from, next) => {
    const loadingStore = useLoadingStore();
    const authStore = useAuthStore()

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

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!authStore.isAuthenticated) {
            next('/login')
            return
        }

        if (to.matched.some(record => record.meta.requiresOrganizer)) {
            if (!authStore.isOrganizer) {
                next('/')
                return
            }
        }

        if (to.matched.some(record => record.meta.requiresMentor)) {
            if (!authStore.isMentor) {
                next('/')
                return
            }
        }

        if (to.matched.some(record => record.meta.requiresMember)) {
            if (!authStore.isMember) {
                next('/')
                return
            }
        }

        if (to.matched.some(record => record.meta.requiresAdmin)) {
            if (!authStore.isAdmin) {
                next('/')
                return
            }
        }
    }

    next()
})

export default router