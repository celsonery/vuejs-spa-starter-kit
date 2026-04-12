export interface LoginCredentials {
    email: string
    password: string
}

export interface AuthUser {
    id: number
    name: string
    email: string
    email_verified_at?: string | null
    created_at?: string
    updated_at?: string
}

export interface LoginResponse {
    access_token: string
    token_type: string
    // expires_in: number
    user?: AuthUser
}

export interface MessageResponse {
    message: string
}

export interface ForgotPasswordPayload {
    email: string
}

export interface ResetPasswordPayload {
    token: string
    email: string
    password: string
    password_confirmation: string
}
