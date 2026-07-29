<script setup lang="ts">
const url = defineModel<string>('url', { default: '' })

defineProps<{
  loading?: boolean
}>()

defineEmits(['add'])
</script>

<template>
  <div class="flex items-center gap-2 w-full max-w-sm">
    <UInput
      v-model="url"
      placeholder="ex: nuxt/nuxt ou URL"
      icon="i-simple-icons-github"
      size="md"
      class="flex-1"
      @keydown.enter="$emit('add')"
    />
    <UButton
      label="Suivre"
      icon="i-lucide-plus"
      size="md"
      :loading="loading"
      @click="$emit('add')"
    />
  </div>
</template>
