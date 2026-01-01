<script setup lang="ts">
const inLateTasks = ref(2)
</script>

<template>
  <UPageCard variant="subtle" title="En retard" orientation="horizontal">
    <div class="text-3xl font-semibold text-center">{{ inLateTasks }}</div>

    <template #footer>
      <UButton variant="ghost" size="xs" trailing-icon="i-lucide-arrow-right">Voir toutes</UButton>
    </template>
  </UPageCard>
</template>
