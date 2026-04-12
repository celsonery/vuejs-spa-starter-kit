<template>
  <div class="flex h-dvh items-center justify-center">
    <Card class="w-full max-w-md p-5 md:p-8">
      <CardHeader class="text-center">
        <CardTitle>Verificação de e-mail</CardTitle>
        <CardDescription>
          {{ verified ? 'Seu e-mail foi verificado.' : 'Verifique sua caixa de entrada para ativar sua conta.' }}
        </CardDescription>
      </CardHeader>

      <CardContent class="flex flex-col items-center gap-4 py-4 text-center">
        <!-- Verificando -->
        <div v-if="verifying" class="flex flex-col items-center gap-3">
          <svg
              class="h-8 w-8 animate-spin text-primary"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
          >
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
          <p class="text-sm text-muted-foreground">Verificando seu e-mail...</p>
        </div>

        <!-- Verificado com sucesso -->
        <div v-else-if="verified" class="flex flex-col items-center gap-3">
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
            Sua conta está ativa. Você já pode usar o sistema normalmente.
          </p>
        </div>

        <!-- Aguardando verificação -->
        <div v-else class="flex flex-col items-center gap-3">
          <div class="rounded-full bg-blue-100 p-4 dark:bg-blue-900">
            <svg
                class="h-8 w-8 text-blue-600 dark:text-blue-400"
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
            Enviamos um link de verificação para <strong>{{ auth.userEmail }}</strong>.
            Clique no link do e-mail para ativar sua conta.
          </p>
        </div>
      </CardContent>

      <CardFooter class="flex flex-col gap-3">
        <Button
            v-if="verified"
            class="w-full"
            @click="router.push({ name: 'dashboard' })"
        >
          Ir para o dashboard
        </Button>

        <template v-else-if="!verifying">
          <Button
              variant="outline"
              class="w-full"
              :disabled="resending"
              @click="resendEmail"
          >
            {{ resending ? 'Reenviando...' : 'Reenviar e-mail de verificação' }}
          </Button>

          <Button
              variant="ghost"
              class="w-full"
              @click="auth.logout().then(() => router.push({ name: 'login' }))"
          >
            Sair
          </Button>
        </template>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { toast } from 'vue-sonner'
import AuthService from '@/services/authService'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const verifying = ref<boolean>(false)
const resending = ref<boolean>(false)
const verified = ref<boolean>(false)

// O Laravel envia o link assinado completo para o e-mail do usuário.
// O frontend apenas apresenta a URL e o backend valida a assinatura.
// Ex: /email/verify?id=1&hash=xxx&expires=xxx&signature=xxx
onMounted(async () => {
  const id        = route.query.id as string | undefined
  const hash      = route.query.hash as string | undefined
  const expires   = route.query.expires as string | undefined
  const signature = route.query.signature as string | undefined

  // Se a URL contém os parâmetros do link assinado, tenta verificar automaticamente
  if (id && hash) {
    await verifyEmail(id, hash, expires, signature)
  }
})

async function verifyEmail(
    id: string,
    hash: string,
    expires?: string,
    signature?: string,
): Promise<void> {
  verifying.value = true
  try {
    // Monta a query string assinada para repassar ao backend
    const params = new URLSearchParams({ expires: expires ?? '', signature: signature ?? '' })

    await AuthService.verifyEmail(id, hash, params.toString())

    // Atualiza o usuário na store para refletir email_verified_at
    await auth.fetchUser()

    verified.value = true
    toast.success('E-mail verificado com sucesso!')
  } catch (err: any) {
    const status = err.response?.status
    if (status === 403) {
      toast.error('Link de verificação inválido ou expirado.')
    } else if (status === 401) {
      toast.error('Você precisa estar logado para verificar seu e-mail.')
      router.push({ name: 'login' })
    } else {
      toast.error('Não foi possível verificar o e-mail.')
    }
  } finally {
    verifying.value = false
  }
}

async function resendEmail(): Promise<void> {
  if (resending.value) return
  resending.value = true
  try {
    const response = await AuthService.resendVerificationEmail()
    toast.success(response.message || 'E-mail de verificação reenviado!')
  } catch (err: any) {
    const status = err.response?.status
    if (status === 429) {
      toast.error('Aguarde antes de solicitar um novo e-mail.')
    } else {
      toast.error('Não foi possível reenviar o e-mail.')
    }
  } finally {
    resending.value = false
  }
}
</script>
