<script setup lang="ts">
const { setLayout } = useLayoutStore()
setLayout({
  title: 'Page'
})
</script>

<template>
  <div class="flex flex-col gap-4 w-full lg:max-w-2xl mx-auto">
    <UPageCard
      title="Page"
      description="Gérer toutes vos tâches."
      variant="naked"
      orientation="horizontal"
    />
  </div>
</template>
