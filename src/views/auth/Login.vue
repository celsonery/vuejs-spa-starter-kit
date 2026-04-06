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
        <CardHeader>
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
                <Input v-model="form.email" id="email" type="email" placeholder="E-mail" required :disabled="loading"/>
              </div>
              <div class="flex flex-col space-y-1.5">
                <div class="flex items-center">
                  <Label for="password">Senha</Label>
                  <a
                      href="#"
                      class="ml-auto inline-block text-sm underline"
                  >
                    Esqueceu sua senha?
                  </a>
                </div>
                <Input v-model="form.password" id="password" type="password" placeholder="Senha" required
                       :disabled="loading"/>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter class="flex flex-col gap-2">
          <Button class="w-full" :disabled="loading">{{ loading ? 'Entrando...' : 'Entrar' }}</Button>
          <p v-if="error" class="text-red-500">{{ error }}</p>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {useAuthStore} from '@/stores/auth'
import {useRouter} from 'vue-router'
import {useDark, useToggle} from "@vueuse/core"
import {Sun, Moon} from 'lucide-vue-next'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Button} from '@/components/ui/button'

const auth = useAuthStore()
const router = useRouter()

const form = ref({email: '', password: ''})
const loading = ref(false)
const error = ref('')
const isDark = useDark()

const toggleDark = useToggle(isDark)

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  try {
    await auth.login(form.value)
    router.push('/dashboard')
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      const serverMessage = error.response.data.message;

      switch (status) {
        case 401:
          throw new Error('E-mail ou senha incorretos.');
        case 403:
          throw new Error('Sua conta está suspensa ou sem permissão.');
        case 422:
          throw new Error('Dados inválidos. Verifique os campos.');
        case 429:
          throw new Error('Muitas tentativas. Tente novamente mais tarde.');
        default:
          throw new Error(serverMessage || 'Ocorreu um erro inesperado.');
      }
    } else if (error.request) {
      throw new Error('Não foi possível conectar ao servidor.');
    } else {
      throw new Error('Erro ao configurar a requisição.');
    }
  } finally {
    loading.value = false
  }
}
</script>
