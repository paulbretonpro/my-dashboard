<script setup lang="ts">
const DEFAULT_PER_PAGE = 20

const { tasks, loading, refresh, filters, total } = useTasks({
  perPage: DEFAULT_PER_PAGE
})
</script>

<template>
  <div class="space-y-4">
    <UiInputTask @new-task-added="refresh" />

    <TasksListTask :tasks :loading @update="refresh" />

    <UPagination
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
