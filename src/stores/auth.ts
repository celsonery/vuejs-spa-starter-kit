import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import type { AxiosError } from 'axios'
import AuthService from '@/services/authService'
import type { AuthUser, LoginCredentials, LoginResponse } from '@/types/auth'

interface ApiErrorResponse {
    message?: string
}

export const useAuthStore = defineStore('auth', () => {
    // State
    const token: Ref<string | null> = ref(localStorage.getItem('access_token'))
    const user: Ref<AuthUser | null> = ref(JSON.parse(localStorage.getItem('auth_user') ?? 'null') as AuthUser | null)
    const loading: Ref<boolean> = ref(false)
    const error: Ref<string | null> = ref(null)

    // Getters
    const isAuthenticated = computed<boolean>(() => !!token.value)
    const isEmailVerified = computed<boolean>(() => !!user.value?.email_verified_at)
    const userName = computed<string>(() => user.value?.name ?? '')
    const userEmail = computed<string>(() => user.value?.email ?? '')

    // Actions
    async function login(credentials: LoginCredentials): Promise<LoginResponse> {
        loading.value = true
        error.value = null

        try {
            const response = await AuthService.login(credentials)

            token.value = response.access_token
            localStorage.setItem('access_token', response.access_token)

            if (response.user) {
                user.value = response.user
                localStorage.setItem('auth_user', JSON.stringify(response.user))
            } else {
                await fetchUser()
            }

            return response
        } catch (err) {
            const axiosError = err as AxiosError<ApiErrorResponse>
            error.value = axiosError.response?.data?.message ?? 'Credenciais inválidas.'
            throw err
        } finally {
            loading.value = false
        }
    }

    async function logout(): Promise<void> {
        loading.value = true
        try {
            await AuthService.logout()
        } catch {
            // Mesmo que o backend falhe, limpamos a sessão localmente
        } finally {
            clearSession()
            loading.value = false
        }
    }

    async function fetchUser(): Promise<void> {
        if (!token.value) return

        try {
            const data = await AuthService.user()
            user.value = data
            localStorage.setItem('auth_user', JSON.stringify(data))
        } catch {
            // O interceptor 401 cuida do redirect se o token for inválido
        }
    }

    function clearSession(): void {
        token.value = null
        user.value = null
        localStorage.removeItem('access_token')
        localStorage.removeItem('auth_user')
    }

    return {
        token,
        user,
        loading,
        error,
        isAuthenticated,
        isEmailVerified,
        userName,
        userEmail,
        login,
        logout,
        fetchUser,
        clearSession,
    }
})

export type AuthStore = ReturnType<typeof useAuthStore>
