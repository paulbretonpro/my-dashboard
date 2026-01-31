<script setup lang="ts">
import type { ArticlesFilters } from '~~/server/api/articles/filters'

const { setLayout } = useLayoutStore()

setLayout({
  title: 'Veille technologique'
})

const articlesRef = ref()

const filters = ref<ArticlesFilters>({
  period: '7d',
  read: 'all' as 'all' | 'read' | 'unread',
  new: false,
  sources: []
})

const handleApplyFilters = () => {
  articlesRef.value?.refresh()
}
</script>

<template>
  <div class="flex flex-col gap-6 w-full lg:max-w-2xl mx-auto">
    <UPageCard
      title="Liste des articles"
      description="Tous les articles issus de vos sources RSS."
      variant="naked"
      orientation="horizontal"
    >
      <WatchArticlesFilters v-model="filters" @apply-filters="handleApplyFilters" class="ml-auto" />
    </UPageCard>

    <WatchArticles ref="articlesRef" :filters />
  </div>
</template>
