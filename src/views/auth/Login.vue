<template>
  <div class="flex flex-col sm:flex-row h-dvh">
    <div class="flex w-full sm:w-1/2 h-20 sm:h-dvh bg-blue-950 justify-center items-center">
      Imagem
    </div>
    <div class="flex w-full sm:w-1/2 flex-col h-dvh bg-gray-100 dark:bg-neutral-900 justify-center items-center">
      <div class="absolute top-5 right-5">
        <Button variant="outline" size="icon" @click="toggleDark()">
          <Sun v-if="isDark" class="h-5 w-5"/>
          <Moon v-else class="h-5 w-5"/>
        </Button>
      </div>

      <Card class="w-full md:max-w-lg px-2 py-10 dark:bg-neutral-950 border-none shadow-lg">

        <CardHeader class="text-center">
          <CardTitle>Entrar no sistema</CardTitle>
          <CardDescription>
            Use suas credenciais para entrar.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form @submit.prevent="handleLogin">
            <div class="grid w-full items-center gap-4">
              <div class="flex flex-col space-y-1.5">
                <Label for="email">Email</Label>
                <div class="relative">
                  <Input
                    id="email"
                    v-model="form.email"
                    type="email"
                    placeholder="E-mail"
                    autocomplete="email"
                    required
                    :disabled="auth.loading"
                    class="pl-10"
                  />
                  <button type="button" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <Mail :size="18" />
                  </button>
                </div>
              </div>

              <div class="flex flex-col space-y-1.5">
                <div class="flex items-center">
                  <Label for="password">Senha</Label>
                  <Router-Link 
                    to="/forgot-password"
                    class="ml-auto inline-block text-sm underline cursor-pointer"
                    >Esqueceu sua senha?</Router-Link>
                </div>
                <div class="relative">
                  <Input
                    id="password"
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="••••••••"
                    required
                    :disabled="auth.loading"
                    class="pl-10"
                  />
                  <button type="button" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <LockKeyhole :size="18" />
                  </button>

                  <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" @click="showPassword = !showPassword">
                    <Eye v-if="!showPassword" :size="18" />
                    <EyeOff v-else :size="18" />
                  </button>
                </div>
              </div>

              <div>
                <Button type="submit" class="w-full mt-4" :disabled="auth.loading">{{
                    auth.loading ? 'Entrando...' : 'Entrar'
                  }}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter class="flex flex-col gap-4">
          <Alert class="bg-gray-100 dark:bg-neutral-900">
            <Shield color="orange" />
            <AlertTitle>ACESSO RESTRITO</AlertTitle>
            <AlertDescription>
              Novos usuários devem ser cadastrados pelo administrador do sistema.
            </AlertDescription>
          </Alert>
        </CardFooter>
      
      </Card>

      <Alert class="w-full md:max-w-lg mt-4 border-0 text-blue-800 dark:text-grey-600 bg-transparent text-center">
        <AlertDescription class="text-[12px]">&copy; 2026 - <a href="https://www.oregon.net.br" target="_blank"> Oregon Tecnologia.</a> Todos os direitos reservados.</AlertDescription>
      </Alert>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useDark, useToggle } from "@vueuse/core"
import { Sun, Moon, Eye, EyeOff, Mail, LockKeyhole, Shield, Copyright, CopyrightIcon } from 'lucide-vue-next'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
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
      const status = error.response?.status;
      const serverMessage = error.response?.data.message;

      switch (status) {
        case 401:
          toast.error(serverMessage || 'E-mail ou senha incorretos.')
          break;
        case 403:
          toast.error(serverMessage || 'Sua conta está suspensa ou sem permissão.')
          break;
        case 422:
          toast.error(serverMessage || 'Dados inválidos. Verifique os campos.')
          break;
        case 429:
          toast.error(serverMessage || 'Muitas tentativas. Tente novamente mais tarde.')
          break;
        default:
          toast.error(serverMessage || 'Ocorreu um erro inesperado.')
          break;
      }
    } else {
      toast.error('Erro de conexão com o servidor.')
    }
  } finally {
    auth.loading = false
  }
}
</script>
