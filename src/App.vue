<script setup lang="ts">
import { useDark } from '@vueuse/core'

const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: '',
})
</script>

<template>
  <router-view />
</template>
