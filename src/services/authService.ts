import api from './api'
import type {
    LoginCredentials,
    LoginResponse,
    AuthUser,
    MessageResponse,
    ForgotPasswordPayload,
    ResetPasswordPayload
} from '@/types/auth'

const AuthService = {
    /**
     * POST /auth/login
     * Laravel retorna: { access_token, token_type, expires_in, user? }
     */
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        const { data } = await api.post<LoginResponse>('/auth/login', credentials)
        return data
    },

    /**
     * POST /auth/logout  (requer token válido no header)
     */
    async logout(): Promise<void> {
        await api.post('/auth/logout')
    },

    /**
     * GET /auth/me — retorna o usuário autenticado
     */
    async user(): Promise<AuthUser> {
        const { data } = await api.get<AuthUser>('/auth/user')
        return data
    },

    /**
     * POST /auth/forgot-password
     * Dispara o e-mail de recuperação de senha
     */
    async forgotPassword(payload: ForgotPasswordPayload): Promise<MessageResponse> {
        const { data } = await api.post<MessageResponse>('/auth/forgot-password', payload)
        return data
    },

    /**
     * POST /auth/reset-password
     * Redefine a senha com token recebido por e-mail
     */
    async resetPassword(payload: ResetPasswordPayload): Promise<MessageResponse> {
        const { data } = await api.post<MessageResponse>('/auth/reset-password', payload)
        return data
    },

    /**
     * POST /auth/email/verify/{id}/{hash}?expires=...&signature=...
     * Verifica o e-mail com o link assinado enviado pelo Laravel
     */
    async verifyEmail(id: string, hash: string, signedQuery: string): Promise<MessageResponse> {
        const { data } = await api.post<MessageResponse>(
          `/auth/email/verify/${id}/${hash}?${signedQuery}`,
        )
        return data
    },

    /**
     * POST /auth/email/resend
     * Reenvia o e-mail de verificação (requer autenticação)
     */
    async resendVerificationEmail(): Promise<MessageResponse> {
        const { data } = await api.post<MessageResponse>('/auth/email/resend')
        return data
    }
}

export default AuthService
