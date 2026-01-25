<script setup lang="ts">
const { setLayout } = useLayoutStore()
setLayout({
  title: 'Veille technologique'
})
</script>

<template>
  <div class="flex flex-col gap-6 w-full lg:max-w-2xl mx-auto">
    <UPageCard
      title="Liste des articles"
      description="Tous les articles issus de vos sources RSS."
      variant="naked"
      orientation="horizontal"
    />

    <WatchArticles />
  </div>
</template>
