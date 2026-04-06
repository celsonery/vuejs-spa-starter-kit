<script setup lang="ts">
import { useDark } from '@vueuse/core'
import AppSidebar from '@/components/AppSidebar.vue'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: '',
})
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <main>
      <SidebarTrigger />
      <slot />
    </main>
  </SidebarProvider>
</template>

