<script setup lang="ts">
import type { ArticlesWithSource } from '~~/shared/types'

defineProps<{
  articles: ArticlesWithSource[]
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
      icon="i-lucide-file-text"
      title="Chargement..."
      description="Si le chargement est trop long, tu as le temps pour un café "
    />

    <template v-else>
      <div v-if="articles.length > 0" class="flex flex-col gap-6 mb-6">
        <UPageColumns>
          <WatchArticlesCard v-for="article in articles" :key="article.id" :article />
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
        icon="i-lucide-file-text"
        title="Aucun article trouvé"
        description="Essaie de modifier tes filtres de recherche pour trouver des articles."
      />
    </template>
  </div>
</template>
