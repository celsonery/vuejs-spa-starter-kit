<template>
  <div class="flex">
    {{ pageTitle }}

    <div class="absolute right-1.5 top-1.5">
      <Button
        variant="outline"
        size="icon"
        @click="toggleDark()"
      >
        <Sun
          v-if="isDark"
          class="h-5 w-5"
        />
        <Moon
          v-else
          class="h-5 w-5"
        />
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue'
import {useRoute} from 'vue-router'
import {Moon, Sun} from 'lucide-vue-next'
import {Button} from '@/components/ui/button'
import {useDark, useToggle} from "@vueuse/core"

const route = useRoute()
const isDark = useDark()
const toggleDark = useToggle(isDark)

const pageTitle = computed(() => {
  return route.meta.title || 'Sindico'
})
</script>
