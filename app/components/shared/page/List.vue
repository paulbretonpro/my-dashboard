<script setup lang="ts" generic="T">
defineProps<{
  items: T[]
  loading: boolean
  total: number
  icon?: string
  emptyMessage: string
  pagination: {
    page: number
    perPage: number
  }
}>()

const emit = defineEmits<{
  'update:pagination': [page: number]
}>()

const handleUpdatePagination = (newPage: number) => {
  emit('update:pagination', newPage)
}
</script>

<template>
  <div v-auto-animate>
    <UEmpty
      v-if="loading"
      :icon
      title="Chargement..."
      description="Si le chargement est trop long, tu as le temps pour un café "
    />

    <template v-else>
      <div v-if="items.length > 0" class="flex flex-col gap-6 mb-6">
        <slot />

        <UPagination
          :page="pagination.page"
          active-variant="outline"
          show-edges
          :items-per-page="pagination.perPage"
          :show-controls="false"
          :sibling-count="1"
          :total
          :ui="{ list: 'justify-end', item: 'ring-0', ellipsis: 'ring-0' }"
          @update:page="handleUpdatePagination"
        />
      </div>
      <UEmpty
        v-else
        :icon
        :title="emptyMessage"
        description="Essaie de modifier tes filtres de recherche."
      />
    </template>
  </div>
</template>
