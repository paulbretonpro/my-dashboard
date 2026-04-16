<script setup lang="ts">
const filters = defineModel<TaskFilters>()

const open = ref(false)

const handleApplyFilters = () => {
  open.value = false
}
</script>

<template>
  <USlideover
    v-model:open="open"
    title="Filtrer les articles"
    description="Affinez la liste des articles en fonction de vos préférences."
  >
    <UButton
      color="neutral"
      variant="subtle"
      label="Filtres"
      icon="i-lucide-filter"
      class="w-fit ml-auto"
    />

    <template #body>
      <div class="flex flex-col gap-4">
        <UiDatepickerRange />
        <TasksTabsHistoryFiltersSelectDeadline class="w-full" />
        <div class="text-muted text-center">Les filtres arrivent bientôt...</div>
      </div>
    </template>

    <template #footer="{ close }">
      <UButton block size="lg" label="Annuler" color="neutral" variant="outline" @click="close" />
      <UButton block size="lg" label="Appliquer" color="neutral" @click="handleApplyFilters" />
    </template>
  </USlideover>
</template>
