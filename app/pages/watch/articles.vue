<script setup lang="ts">
import type { ArticlesFilters } from '~~/server/api/articles/filters'
import type { CountArticleBySourceType, ArticlesWithSource } from '~~/shared/types'

const { setLayout } = useLayoutStore()

setLayout({
  title: 'Veille technologique'
})

const { isDesktop, isMobile } = useDevice()

const sourceTypesCount = ref<CountArticleBySourceType[]>([])

const filters = ref<ArticlesFilters>({
  period: '7d',
  read: 'all' as 'all' | 'read' | 'unread',
  latest: undefined,
  sources: [],
  sourcesTypes: []
})

const pagination = ref({
  page: 1,
  perPage: 10
})

const loading = ref(true)
const total = ref(0)
const articles = ref<ArticlesWithSource[]>([])

const buildFetchQuery = () => {
  return {
    page: pagination.value.page,
    perPage: pagination.value.perPage,
    ...filters.value
  }
}

const handleFetchArticles = async () => {
  loading.value = true
  try {
    const data = await $fetch<PaginatedResponse<ArticlesWithSource>>('/api/articles', {
      query: buildFetchQuery()
    })

    articles.value = data.data
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const handleUpdatePagination = (newPage: number) => {
  pagination.value.page = newPage
  handleFetchArticles()
}

const handleApplyFilters = () => {
  pagination.value.page = 1
  Promise.all([handleFetchArticles(), handleFetchCountArticlesBySourceType()])
}

const handleFetchCountArticlesBySourceType = async () => {
  try {
    const data = await $fetch<CountArticleBySourceType[]>('/api/articles/source-types', {
      query: {
        ...filters.value
      }
    })
    sourceTypesCount.value = data
  } catch (error) {
    console.error('Error fetching count of articles by source type:', error)
    sourceTypesCount.value = []
  }
}

const updateSourcesTypesFilters = (newFilters: ArticlesFilters) => {
  filters.value.sourcesTypes = newFilters.sourcesTypes
  handleApplyFilters()
}

onMounted(() => {
  Promise.all([handleFetchArticles(), handleFetchCountArticlesBySourceType()])
})
</script>

<template>
  <div class="flex flex-col gap-6 w-full lg:max-w-7xl mx-auto">
    <UPageCard
      title="Liste des articles"
      description="Tous les articles issus de vos sources RSS."
      variant="naked"
      orientation="horizontal"
    >
      <WatchArticlesFilters
        v-if="isDesktop"
        v-model="filters"
        @apply-filters="handleApplyFilters"
        class="ml-auto"
      />

      <template #footer>
        <WatchArticlesFiltersBySourceType
          :filters="filters"
          :data="sourceTypesCount"
          @update:filters="updateSourcesTypesFilters"
        />
      </template>
    </UPageCard>

    <WatchArticles
      :articles
      :loading
      :total
      :pagination
      @update:pagination="handleUpdatePagination"
    />

    <div class="absolute bottom-16 right-12">
      <WatchArticlesFilters
        v-if="isMobile"
        v-model="filters"
        @apply-filters="handleApplyFilters"
        class="ml-auto"
      />
    </div>
  </div>
</template>
