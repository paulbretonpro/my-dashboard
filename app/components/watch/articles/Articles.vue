<script setup lang="ts">
import type { ArticlesWithSource } from '~~/shared/types'

const pagination = ref({
  page: 1,
  perPage: 10
})

const loading = ref(true)
const total = ref(0)
const posts = ref<ArticlesWithSource[]>([])

const handleFetch = async () => {
  loading.value = true
  try {
    const data = await $fetch<PaginatedResponse<ArticlesWithSource>>('/api/articles', {
      query: {
        page: pagination.value.page,
        perPage: pagination.value.perPage
      }
    })

    posts.value = data.data
    total.value = data.total
  } finally {
    loading.value = false
  }
}

watch(pagination, handleFetch, { deep: true })

onMounted(handleFetch)
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
      <div class="flex flex-col gap-6 mb-6">
        <WatchArticlesCard v-for="article in posts" :key="article.id" :article />
      </div>
      <UPagination
        v-model:page="pagination.page"
        active-variant="outline"
        show-edges
        :items-per-page="pagination.perPage"
        :show-controls="false"
        :sibling-count="1"
        :total
        :ui="{ list: 'justify-end', item: 'ring-0', ellipsis: 'ring-0' }"
      />
    </template>
  </div>
</template>
