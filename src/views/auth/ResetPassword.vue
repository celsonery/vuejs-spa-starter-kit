<template>
  <div class="flex h-dvh items-center justify-center">
    <Card class="w-full max-w-md p-5 md:p-8">
      <CardHeader class="text-center">
        <CardTitle>Redefinir senha</CardTitle>
        <CardDescription>
          Escolha uma nova senha para sua conta.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <!-- Sucesso -->
        <div v-if="success" class="flex flex-col items-center gap-4 py-4 text-center">
          <div class="rounded-full bg-green-100 p-4 dark:bg-green-900">
            <svg
                class="h-8 w-8 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p class="text-sm text-muted-foreground">
            Sua senha foi redefinida com sucesso. Já pode fazer login com a nova senha.
          </p>
        </div>

        <!-- Formulário -->
        <div v-else class="grid gap-4">
          <div class="flex flex-col space-y-1.5">
            <Label for="email">E-mail</Label>
            <Input
                id="email"
                :value="email"
                type="email"
                disabled
            />
          </div>

          <div class="flex flex-col space-y-1.5">
            <Label for="password">Nova senha</Label>
            <div class="relative">
              <Input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Mínimo 8 caracteres"
                  :disabled="auth.loading"
                  class="pr-16"
              />
              <button
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                  @click="showPassword = !showPassword"
              >
                {{ showPassword ? 'Ocultar' : 'Mostrar' }}
              </button>
            </div>
          </div>

          <div class="flex flex-col space-y-1.5">
            <Label for="password-confirmation">Confirmar nova senha</Label>
            <div class="relative">
              <Input
                  id="password-confirmation"
                  v-model="passwordConfirmation"
                  :type="showPasswordConfirmation ? 'text' : 'password'"
                  placeholder="Repita a nova senha"
                  :disabled="auth.loading"
                  :class="['pr-16', passwordMismatch ? 'border-red-500 focus-visible:ring-red-500' : '']"
              />
              <button
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                  @click="showPasswordConfirmation = !showPasswordConfirmation"
              >
                {{ showPasswordConfirmation ? 'Ocultar' : 'Mostrar' }}
              </button>
            </div>
            <p v-if="passwordMismatch" class="text-xs text-red-500">
              As senhas não coincidem.
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter class="flex flex-col gap-3">
        <Button
            v-if="!success"
            class="w-full"
            :disabled="auth.loading || !password || !passwordConfirmation || passwordMismatch"
            @click="handleSubmit"
        >
          {{ auth.loading ? 'Redefinindo...' : 'Redefinir senha' }}
        </Button>

        <Button
            :variant="success ? 'default' : 'ghost'"
            class="w-full"
            @click="router.push({ name: 'login' })"
        >
          Ir para o login
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { toast } from 'vue-sonner'
import AuthService from '@/services/authService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

// Laravel envia o link: /reset-password?token=xxx&email=xxx
const token = ref<string>('')
const email = ref<string>('')
const password = ref<string>('')
const passwordConfirmation = ref<string>('')
const success = ref<boolean>(false)
const showPassword = ref<boolean>(false)
const showPasswordConfirmation = ref<boolean>(false)

const passwordMismatch = computed<boolean>(
    () => !!passwordConfirmation.value && password.value !== passwordConfirmation.value,
)

onMounted(() => {
  token.value = (route.query.token as string) ?? ''
  email.value = (route.query.email as string) ?? ''

  if (!token.value || !email.value) {
    toast.error('Link de redefinição inválido ou expirado.')
    router.push({ name: 'forgot-password' })
  }
})

async function handleSubmit(): Promise<void> {
  if (auth.loading || passwordMismatch.value) return
  auth.loading = true

  try {
    const response = await AuthService.resetPassword({
      token: token.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    })

    success.value = true
    toast.success(response.message || 'Senha redefinida com sucesso!')
  } catch (err: any) {
    const status = err.response?.status
    const message = err.response?.data?.message

    if (status === 422) {
      const errors = err.response?.data?.errors
      const firstError = errors ? Object.values(errors).flat()[0] : null
      toast.error((firstError as string) || 'Dados inválidos. Verifique os campos.')
    } else if (status === 400) {
      toast.error('Token inválido ou expirado. Solicite um novo link.')
    } else {
      toast.error(message || 'Não foi possível redefinir a senha.')
    }
  } finally {
    auth.loading = false
  }
}
</script>
