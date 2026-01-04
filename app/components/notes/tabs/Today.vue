<script setup lang="ts">
import { today } from '@/utils/date'

const DEFAULT_PER_PAGE = 100

const { tasks, loading, refresh, filters, total } = useTasks({
  createdAt: today.toString(),
  perPage: DEFAULT_PER_PAGE
})

const displayPagination = computed(() => total.value > DEFAULT_PER_PAGE)
</script>

<template>
  <div class="space-y-4">
    <UiInputTask @new-task-added="refresh" />

    <NotesListTask :tasks :loading @update="refresh" />

    <UPagination
      v-if="displayPagination"
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
