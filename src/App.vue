<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import { useDark } from '@vueuse/core'
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'

const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: '',
})
const auth = useAuthStore()

onMounted(() => {
  if (auth.token && !auth.user) {
    auth.fetchUser()
  }
})
</script>

<template>
  <RouterView />

  <Toaster
    position="top-right"
    rich-colors
    close-button
    :theme="isDark ? 'dark' : 'light'"
  />
</template>
