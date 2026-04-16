<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { BadgeCheck, Bell, ChevronsUpDown, LogOut, Sparkles } from 'lucide-vue-next'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'

const auth = useAuthStore()
const { user } = storeToRefs(auth)
const router = useRouter()

const userInitials = computed(() =>
    user.value.name.substring(0, 2).toUpperCase()
)

const handlerLogout = async () => {
  auth.loading = true
  try {
    await auth.logout()
    await router.push('/login')
  } catch (error: any) {
    console.error(error)
  } finally {
    auth.loading = false
  }
}
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu :modal="false">
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
              size="lg"
              class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar class="h-8 w-8 rounded-full">
              <!-- <AvatarImage :src="user.avatar" :alt="user.name" loading="lazy" /> -->
              <AvatarFallback class="rounded-full bg-blue-600 text-white font-bold text-xs">
                {{ userInitials }}
              </AvatarFallback>
            </Avatar>

            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-semibold">{{ user.name }}</span>
              <span class="truncate text-xs text-muted-foreground">{{ user.email }}</span>
            </div>

            <ChevronsUpDown class="ml-auto size-4 shrink-0 opacity-50" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>

        <DropdownMenuContent
            class="min-w-56 rounded-lg data-[state=open]:animate-none data-[state=closed]:animate-none"
            side="top"
            align="end"
            :side-offset="4"
        >
          <!-- Cabeçalho com info do usuário -->
          <div class="flex items-center gap-2 px-2 py-2">
            <Avatar class="h-9 w-9 rounded-full">
              <!-- <AvatarImage :src="user.avatar" :alt="user.name" loading="lazy" /> -->
              <AvatarFallback class="rounded-full bg-blue-600 text-white font-bold text-xs">
                {{ userInitials }}
              </AvatarFallback>
            </Avatar>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-semibold">{{ user.name }}</span>
              <span class="truncate text-xs text-muted-foreground">{{ user.email }}</span>
            </div>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem class="cursor-pointer">
              <Sparkles class="mr-2 h-4 w-4 text-blue-500" />
              Upgrade para Pro
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem class="cursor-pointer" @click="() => router.push('/account')">
              <BadgeCheck class="mr-2 h-4 w-4" />
              Minha Conta
            </DropdownMenuItem>
            <DropdownMenuItem class="cursor-pointer">
              <Bell class="mr-2 h-4 w-4" />
              Notificações
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem
              class="cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950/30"
              @click="handlerLogout"
          >
            <LogOut class="mr-2 h-4 w-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
