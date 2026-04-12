<template>
  <div class="flex h-dvh items-center justify-center">
    <Card class="w-full max-w-md p-5 md:p-8">
      <CardHeader class="text-center">
        <CardTitle>Esqueceu sua senha?</CardTitle>
        <CardDescription>
          Informe seu e-mail e enviaremos um link para redefinir sua senha.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <!-- Estado: e-mail enviado -->
        <div v-if="sent" class="flex flex-col items-center gap-4 py-4 text-center">
          <div class="rounded-full bg-green-100 p-4 dark:bg-green-900">
            <svg
                class="h-8 w-8 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <p class="text-sm text-muted-foreground">
            Enviamos um link de recuperação para <strong>{{ email }}</strong>.
            Verifique sua caixa de entrada e a pasta de spam.
          </p>
        </div>

        <!-- Estado: formulário -->
        <div v-else class="grid gap-4">
          <div class="flex flex-col space-y-1.5">
            <Label for="email">E-mail</Label>
            <Input
                id="email"
                v-model="email"
                type="email"
                placeholder="seu@email.com"
                autocomplete="email"
                :disabled="auth.loading"
                @keyup.enter="handleSubmit"
            />
          </div>
        </div>
      </CardContent>

      <CardFooter class="flex flex-col gap-3">
        <Button
            v-if="!sent"
            class="w-full"
            :disabled="auth.loading || !email"
            @click="handleSubmit"
        >
          {{ auth.loading ? 'Enviando...' : 'Enviar link de recuperação' }}
        </Button>

        <Button
            v-if="sent"
            variant="outline"
            class="w-full"
            :disabled="auth.loading"
            @click="sent = false"
        >
          {{ auth.loading ? 'Reenviando...' : 'Reenviar e-mail' }}
        </Button>

        <Button variant="ghost" class="w-full" @click="router.push({ name: 'login' })">
          Voltar ao login
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
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
const auth = useAuthStore()

const email = ref<string>('')
const sent = ref<boolean>(false)

async function handleSubmit(): Promise<void> {
  if (auth.loading) return

  try {
    const response = await AuthService.forgotPassword({ email: email.value })
    sent.value = true
    toast.success(response.message || 'E-mail de recuperação enviado!')
  } catch (err: any) {
    const status = err.response?.status
    const message = err.response?.data?.message

    if (status === 422) {
      toast.error('Informe um e-mail válido.')
    } else if (status === 429) {
      toast.error('Muitas tentativas. Tente novamente mais tarde.')
    } else {
      toast.error(message || 'Não foi possível enviar o e-mail.')
    }
  } finally {
    auth.loading = false
  }
}
</script>
