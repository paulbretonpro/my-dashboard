<script setup lang="ts">
import { today } from '@/utils/date'

const { tasks, status, pending, filters, total, refresh, updateSearch } = useTasks({
  createdBefore: today.toString()
})

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

    <NotesListTask :tasks="tasks" :loading="pending || isLoading(status)" @update="refresh" />

    <UPagination
      v-if="hasTasks"
      v-model:page="filters.page"
      active-variant="outline"
      show-edges
      :items-per-page="filters.perPage"
      :show-controls="false"
      :sibling-count="1"
      :total
      :ui="{ list: 'justify-end', item: 'ring-0', ellipsis: 'ring-0' }"
    />
  </div>
</template>
