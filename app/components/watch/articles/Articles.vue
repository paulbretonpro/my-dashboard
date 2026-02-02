<script setup lang="ts">
import type { ArticlesFilters } from '~~/server/api/articles/filters'
import type { ArticlesWithSource } from '~~/shared/types'

const props = defineProps<{
  filters: ArticlesFilters
}>()

const pagination = ref({
  page: 1,
  perPage: 10
})

const loading = ref(true)
const total = ref(0)
const posts = ref<ArticlesWithSource[]>([])

const buildFetchQuery = () => ({
  page: pagination.value.page,
  perPage: pagination.value.perPage,
  ...props.filters
})

const handleFetch = async () => {
  loading.value = true
  try {
    const data = await $fetch<PaginatedResponse<ArticlesWithSource>>('/api/articles', {
      query: buildFetchQuery()
    })

    posts.value = data.data
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const handleUpdatePagination = (newPage: number) => {
  pagination.value.page = newPage
  handleFetch()
}

const refresh = () => {
  pagination.value.page = 1
  handleFetch()
}

onMounted(handleFetch)

defineExpose({ refresh })
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
      <div v-if="posts.length > 0" class="flex flex-col gap-6 mb-6">
        <WatchArticlesCard v-for="article in posts" :key="article.id" :article />

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
