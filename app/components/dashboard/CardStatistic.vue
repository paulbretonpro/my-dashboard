<script setup lang="ts">
defineProps<{
  title: string
  description: string
  count: number
}>()
</script>

<template>
  <UPageCard variant="subtle" :title :description spotlight spotlight-color="primary" to="/tasks">
    <div class="text-3xl font-semibold text-center">{{ count }}</div>
  </UPageCard>
</template>
