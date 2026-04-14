<script setup lang="ts">
defineProps<{
  summary: Summary[]
  loading: boolean
  total: number
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
      icon="i-lucide-folder-open"
      title="Chargement..."
      description="Si le chargement est trop long, tu as le temps pour un café "
    />

    <template v-else>
      <div v-if="summary.length > 0" class="flex flex-col gap-6 mb-6">
        <UPageColumns>
          <UCard
            v-for="item in summary"
            :key="item.id"
            variant="soft"
            @click="navigateTo(`/watch/summary/${item.id}`)"
            class="hover:cursor-pointer"
          >
            <div class="flex items-center justify-between gap-4 mb-4">
              <div>{{ item.title }}</div>
              <UButton color="neutral" variant="subtle" icon="i-lucide-ellipsis-vertical" />
            </div>
            <div class="text-sm text-muted">
              {{ new Date(item.createdAt).toLocaleDateString() }}
            </div>
          </UCard>
        </UPageColumns>

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
        icon="i-lucide-folder-open"
        title="Aucun résumé trouvé"
        description="Essaie de modifier tes filtres de recherche pour trouver des résumés."
      />
    </template>
  </div>
</template>
