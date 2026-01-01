<script setup lang="ts">
import { today } from '@/utils/date'

const { tasks, status, pending, filters, total, updateSearch } = useTasks({
  createdBefore: today.toString()
})

const statusOptions = [
  { label: 'Tous', value: 'all' },
  { label: 'Terminer', value: 'true' },
  { label: 'À faire', value: 'false' }
]

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
      <USelect v-model="filters.status" placeholder="Status" :items="statusOptions" class="w-32" />
    </div>

    <NotesListTask :tasks="tasks" :loading="pending || isLoading(status)" />

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
