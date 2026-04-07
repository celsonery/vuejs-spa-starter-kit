import { defineStore } from 'pinia'
import api from '@/services/api'

interface LoginCredentials {
    email: string
    password: string
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('access_token') || null,
        loading: false,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
    },

    actions: {
        async login(credentials: LoginCredentials) {
            try {
                const {data} = await api.post('/auth/login', credentials)
                this.user = data.user
                this.token = data.user.access_token
                localStorage.setItem('access_token', data.user.access_token)
                return true
            } catch (error) {
                throw error
            }
        },

        async logout() {
            try {
                await api.post('/auth/logout')
            } catch (error) {
                throw error
            } finally {
                this.user = null
                this.token = null
                localStorage.removeItem('access_token')
            }
        }
    }
})
