<script setup lang="ts">
import type { ArticlesFilters } from '~~/server/api/articles/filters'

const { setLayout } = useLayoutStore()

setLayout({
  title: 'Veille technologique'
})

const { isDesktop, isMobile } = useDevice()

const articlesRef = ref()

const filters = ref<ArticlesFilters>({
  period: '7d',
  read: 'all' as 'all' | 'read' | 'unread',
  latest: undefined,
  sources: []
})

const handleApplyFilters = () => {
  articlesRef.value?.refresh()
}
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
    </UPageCard>

    <WatchArticles ref="articlesRef" :filters />

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
