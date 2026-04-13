<template>
  <div class="flex flex-col sm:flex-row h-dvh">
    <div class="flex w-full sm:w-1/2 h-20 sm:h-dvh bg-blue-950 justify-center items-center">
      Imagem
    </div>
    <div class="flex w-full sm:w-1/2 flex-col h-dvh justify-center items-center">
      <div class="absolute top-5 right-5">
        <Button variant="outline" size="icon" @click="toggleDark()">
          <Sun v-if="isDark" class="h-5 w-5"/>
          <Moon v-else class="h-5 w-5"/>
        </Button>
      </div>
      <Card class="w-full md:max-w-lg p-5 md:p-12 bg-transparent border-none">
        <CardHeader class="text-center">
          <CardTitle>Entrar no sistema</CardTitle>
          <CardDescription>
            Use suas credenciais para entrar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div class="grid w-full items-center gap-4">
              <div class="flex flex-col space-y-1.5">
                <Label for="email">Email</Label>
                <Input
                  id="email"
                  v-model="form.email"
                  type="email"
                  placeholder="E-mail"
                  autocomplete="email"
                  required
                  :disabled="auth.loading"
                />
              </div>

              <div class="flex flex-col space-y-1.5">
                <div class="flex items-center">
                  <Label for="password">Senha</Label>
                  <Button variant="link"
                      @click.prevent="forgotPassword"
                      class="ml-auto inline-block text-sm underline cursor-pointer"
                  >
                    Esqueceu sua senha?
                  </Button>
                </div>
                <div class="relative">
                    <Input
                      id="password"
                      v-model="form.password"
                      :type="showPassword ? 'text' : 'password'"
                      placeholder="••••••••"
                      required
                      :disabled="auth.loading"
                    />
                    <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" @click="showPassword = !showPassword">
                      <Eye v-if="!showPassword" :size="18" />
                      <EyeOff v-else :size="18" />
                    </button>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter class="flex flex-col gap-2">
          <Button @click.prevent="handleLogin" class="w-full" :disabled="auth.loading">{{
              auth.loading ? 'Entrando...' : 'Entrar'
            }}
          </Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useDark, useToggle } from "@vueuse/core"
import { Sun, Moon, Eye, EyeOff } from 'lucide-vue-next'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'vue-sonner'
import type { LoginCredentials } from '@/types/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const form = ref<LoginCredentials>({ email: '', password: '' })
const showPassword = ref<boolean>(false)
const isDark = useDark()
const toggleDark = useToggle(isDark)

const sessionExpired = computed<boolean>(() => route.query.expeired === '1')


async function forgotPassword(): Promise<void> {
  await router.push({ name: 'forgot-password'})
}

async function handleLogin(): Promise<void> {
  if (auth.loading) return

  try {
    await auth.login(form.value)
    const redirect = (route.query.redirect as string | undefined) ?? '/dashboard'
    await router.push(redirect)
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status;
      const serverMessage = error.response.data.message;

      switch (status) {
        case 401:
          toast.error('E-mail ou senha incorretos.', { duration: 5000 })
          break;
        case 403:
          toast.error('Sua conta está suspensa ou sem permissão.', { duration: 5000 })
          break;
        case 422:
          toast.error('Dados inválidos. Verifique os campos.', { duration: 5000 })
          break;
        case 429:
          toast.error('Muitas tentativas. Tente novamente mais tarde.', { duration: 5000 })
          break;
        default:
          toast.error(serverMessage || 'Ocorreu um erro inesperado.', { duration: 5000 })
          break;
      }
    } else {
      toast.error('Erro de conexão com o servidor.', { duration: 5000 })
    }
  } finally {
    auth.loading = false
  }
}
</script>
