<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import { useDark } from '@vueuse/core'

const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: '',
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
