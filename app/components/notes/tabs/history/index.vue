<script setup lang="ts">
const { tasks, loading, pagination, filters, total, refresh, updateSearch } = useTasks()

const hasTasks = computed(() => total.value > 0)
</script>

<template>
  <div class="space-y-4">
    <div class="flex gap-4 justify-end">
      <UInput
        :model-value="filters.search || ''"
        placeholder="Rechercher"
        icon="i-lucide-search"
        @update:modelValue="updateSearch"
      />

      <NotesTabsHistoryFiltersSelectStatus v-model="filters.status" />

      <NotesTabsHistoryFiltersModal v-model="filters" />
    </div>

    <NotesListTask :tasks :loading @update="refresh" />

    <UPagination
      v-if="hasTasks"
      v-model:page="pagination.page"
      active-variant="outline"
      show-edges
      :items-per-page="pagination.perPage"
      :show-controls="false"
      :sibling-count="1"
      :total
      :ui="{ list: 'justify-end', item: 'ring-0', ellipsis: 'ring-0' }"
    />
  </div>
</template>
