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
import NotFoundPage from "@/views/NotFoundPage.vue";
import {useStageStore} from "@/stores/stage.js";
import JudgePage from "@/views/JudgePage.vue";
import EmailVerificationPage from "@/views/EmailVerificationPage.vue";

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
            component: LoginPage,
            meta: {
                requiresGuest: true
            }
        },
        {
            path: '/auth/verify-email/:token',
            name: 'EmailVerification',
            component: EmailVerificationPage,
            meta: {
                requiresGuest: true
            }
        },
        {
            path: '/registration',
            name: 'registration',
            component: RegistrationPage,
            meta: {
                requiresGuest: true,
                requiresRegistrationStage: true,
            }
        },
        {
            path: '/register/special',
            name: 'SpecialRegistration',
            component: SpecialRegistrationPage,
            meta: {
                hideNavigation: true,
                requiresGuest: true
            }
        },
        {
            path: '/team/apply',
            name: 'TeamApplication',
            component: TeamApplication,
            meta: {
                requiresAuth: true,
                requiresMember: true,
                requiresRegistrationStage: true,
                requiresNotHaveTeam: true,
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
        },
        {
            path: '/judge/teams',
            name: 'JudgeTeams',
            component: JudgePage,
            meta: {
                requiresAuth: true,
                requiresJudge: true
            }
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: NotFoundPage
        }
    ]
})

router.beforeEach(async (to, from, next) => {
    const loadingStore = useLoadingStore();
    const authStore = useAuthStore()
    const stageStore = useStageStore()

    if (!stageStore.currentStage) {
        try {
            await stageStore.initializeStage()
        } catch (error) {
            console.error('Failed to initialize stage:', error)
        }
    }

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

    if (to.matched.some(record => record.meta.requiresNotHaveTeam)) {
        if (authStore.isHaveTeam) {
            next('/')
            return
        }
    }

    if (to.matched.some(record => record.meta.requiresGuest)) {
        if (authStore.isAuthenticated) {
            next('/')
            return
        }
    }

    if (to.matched.some(record => record.meta.requiresRegistrationStage)) {
        if (!stageStore.isRegistration) {
            next('/')
            return
        }
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

        if (to.matched.some(record => record.meta.requiresJudge)) {
            if (!authStore.isJudge) {
                next('/')
                return
            }
        }
    }

    next()
})

export default router
