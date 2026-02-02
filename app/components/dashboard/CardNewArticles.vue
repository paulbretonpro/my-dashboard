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
    orientation="horizontal"
  >
    <div class="text-3xl font-semibold text-center">{{ count }}</div>

    <template #footer>
      <NuxtLink to="/watch/articles">
        <UButton variant="ghost" size="xs" trailing-icon="i-lucide-arrow-right">Voir tous</UButton>
      </NuxtLink>
    </template>
  </UPageCard>
</template>
