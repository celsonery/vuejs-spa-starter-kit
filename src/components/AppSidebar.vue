<script setup lang="ts">
import { Home, Settings } from 'lucide-vue-next'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import AppLogo from "@/components/AppLogo.vue";
import UserProfile from "@/components/UserProfile.vue";

// Menu items.
const items = [
  { title: 'Dashboard', url: '/dashboard', icon: Home },
  { title: 'Settings', url: '/settings', icon: Settings },
]
</script>

<template>
  <Sidebar>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel class="justify-center p-9">
          <AppLogo />
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in items" :key="item.title">
              <SidebarMenuButton as-child>
                <router-link :to="item.url">
                  <component :is="item.icon" />
                  <span>{{ item.title }}</span>
                </router-link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter class="border-t-1">
      <UserProfile />
    </SidebarFooter>
  </Sidebar>
</template>
