<script setup lang="ts">
import {SidebarInset, SidebarProvider, SidebarTrigger} from '@/components/ui/sidebar'
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header class="flex h-12 items-center gap-3 border-b px-4">
        <SidebarTrigger />
        <AppHeader />
      </header>
      <router-view/>
    </SidebarInset>
  </SidebarProvider>
</template>
