import {createRouter, createWebHistory} from 'vue-router'
import {useAuthStore} from '@/stores/auth'
import AppLayout from '@/components/AppLayout.vue'
import Dashboard from '@/views/Dashboard.vue'
import Settings from '@/views/Settings.vue'
import Login from '@/views/auth/Login.vue'
import MyAccount from '@/views/Application/MyAccount.vue'
import ErrorNotFound from '@/views/ErrorNotFound.vue'

const routes = [
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {requiresAuth: false}
    },
    {
        path: '/',
        component: AppLayout,
        redirect: '/dashboard',
        meta: {requiresAuth: true},
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                component: Dashboard,
                meta: {title: 'Dashboard'}
            },
            {
                path: '/settings',
                component: Settings,
                meta: {title: 'Settings'}
            },
            {
                path: '/account',
                component: MyAccount,
                meta: {title: 'Account'}
            },
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: ErrorNotFound
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

router.beforeEach(async (to, from, next) => {
    const auth = useAuthStore()

    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        next({name: 'login'})
    } else if (to.name === 'login' && auth.isAuthenticated) {
        next({name: 'dashboard'})
    } else {
        next()
    }
})
export default router
