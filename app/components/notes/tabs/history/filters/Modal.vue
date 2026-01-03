<script setup lang="ts">
const filters = defineModel<TaskFilters>()
</script>

<template>
  <UModal title="Filtres">
    <UButton color="neutral" variant="outline" icon="i-lucide-filter" />

    <template #body>
      <div class="grid grid-cols-2 gap-4">
        <UiDatepickerRange />
        <NotesTabsHistoryFiltersSelectDeadline class="w-full" />
      </div>
    </template>
  </UModal>
</template>
