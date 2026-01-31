<script setup lang="ts">
import type { ArticlesWithSource } from '~~/shared/types'

const pagination = ref({
  page: 1,
  perPage: 10
})

const loading = ref(true)
const total = ref(0)
const posts = ref<ArticlesWithSource[]>([])

const route = useRoute()
const router = useRouter()

const syncPaginationFromRoute = () => {
  const page = Number(route.query.page) || 1
  const perPage = Number(route.query.perPage) || 10

  if (pagination.value.page !== page) pagination.value.page = page
  if (pagination.value.perPage !== perPage) pagination.value.perPage = perPage
}

const buildFetchQuery = () => ({
  page: pagination.value.page,
  perPage: pagination.value.perPage,
  period: route.query.period,
  read: route.query.read,
  new: route.query.new,
  sources: route.query.sources
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

watch(
  () => route.query,
  () => {
    syncPaginationFromRoute()
    handleFetch()
  },
  { deep: true }
)

watch(
  pagination,
  () => {
    const nextQuery = {
      ...route.query,
      page: pagination.value.page,
      perPage: pagination.value.perPage
    }

    const pageMatches = String(route.query.page || 1) === String(nextQuery.page)
    const perPageMatches = String(route.query.perPage || 10) === String(nextQuery.perPage)
    if (pageMatches && perPageMatches) return

    router.replace({ query: nextQuery })
  },
  { deep: true }
)

onMounted(() => {
  syncPaginationFromRoute()
  handleFetch()
})
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
