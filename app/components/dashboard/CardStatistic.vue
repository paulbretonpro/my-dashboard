<script setup lang="ts">
defineProps<{
  title: string
  count: number
}>()
</script>

<template>
  <UPageCard variant="subtle" :title orientation="horizontal">
    <div class="text-3xl font-semibold text-center">{{ count }}</div>

    <template #footer>
      <UButton variant="ghost" size="xs" trailing-icon="i-lucide-arrow-right">Voir toutes</UButton>
    </template>
  </UPageCard>
</template>
