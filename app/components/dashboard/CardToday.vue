<script setup lang="ts">
const inLateTasks = ref(8)
</script>

<template>
  <UPageCard variant="subtle" title="Aujourd'hui" orientation="horizontal">
    <div class="text-3xl font-semibold text-center">{{ inLateTasks }}</div>

    <template #footer>
      <UButton variant="ghost" size="xs" trailing-icon="i-lucide-arrow-right">Voir toutes</UButton>
    </template>
  </UPageCard>
</template>
