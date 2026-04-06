import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
    },

    actions: {
        async login(credentials) {
            try {
                const {data} = await api.post('/auth/login', credentials)
                console.log(data)
                this.token = data.token
                localStorage.setItem('token', data.token)
                return true
            } catch (error) {
                console.log(error)
                throw error
            }
        },

        async logout() {
            try {
                await api.post('/auth/logout')
            } finally {
                this.token = null
                localStorage.removeItem('token')
            }
        }
    }
})
