import {createRouter, createWebHistory} from 'vue-router'
import {useAuthStore} from '@/stores/auth.ts'
import AppLayout from '@/components/AppLayout.vue'

const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/auth/Login.vue'),
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
                component: () => import('@/views/Dashboard.vue'),
                meta: {title: 'Dashboard'}
            },
            {
                path: '/settings',
                component: () => import('@/views/Settings.vue'),
                meta: {title: 'Settings'}
            },
            {
                path: '/account',
                component: () => import('@/views/Application/MyAccount.vue'),
                meta: {title: 'Account'}
            },
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: () => import('@/views/ErrorNotFound.vue')
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

router.beforeEach(async (to, _from, next) => {
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
