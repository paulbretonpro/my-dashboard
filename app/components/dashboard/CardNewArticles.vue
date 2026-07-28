<script setup lang="ts">
defineProps<{
  count: number
}>()
</script>

<template>
  <UPageCard
    variant="subtle"
    title="Nouveaux articles"
    description="Les articles publiés depuis votre dernière connexion"
    spotlight
    spotlight-color="primary"
    class="cursor-pointer"
    to="/watch/articles"
  >
    <div class="text-3xl font-semibold text-center">{{ count }}</div>
  </UPageCard>
</template>
