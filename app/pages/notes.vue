<script setup lang="ts">
const { setLayout } = useLayoutStore()

setLayout({
  title: 'Bloc notes'
})
</script>

<template>
  <div class="flex flex-col gap-4 w-full lg:max-w-2xl mx-auto">
    <UPageCard
      title="Bloc notes"
      description="Gérer toutes vos tâches."
      variant="naked"
      orientation="horizontal"
    />

    <NotesTabs class="mb-4" />
  </div>
</template>
