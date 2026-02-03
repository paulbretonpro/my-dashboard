<script setup lang="ts">
import type { ArticlesWithSource } from '~~/shared/types'

const props = defineProps<{
  article: ArticlesWithSource
}>()

const loading = ref(false)

const handleReadArticle = async () => {
  loading.value = true

  try {
    if (props.article.isRead) {
      return
    }

    await $fetch(`/api/articles/${props.article.id}`, {
      method: 'PUT',
      body: {
        read: true
      }
    })
  } finally {
    loading.value = false
    navigateTo(props.article.link, { external: true, open: { target: '_blank' } })
  }
}
</script>

<template>
  <UPageCard
    orientation="vertical"
    variant="outline"
    :ui="{ leading: 'w-full' }"
    class="hover:bg-elevated/50 transition-all"
  >
    <template #leading>
      <div class="w-full flex justify-between items-center gap-2">
        <UBadge :label="article.source.name" variant="soft" />
      </div>
    </template>
    <template #title>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-medium">{{ article.title }}</h3>
      </div>
    </template>

    <template #description v-if="article.publishedAt">
      {{ new Date(article.publishedAt).toLocaleDateString() }}
    </template>

    <UButton
      variant="ghost"
      label="Lire l'article"
      trailing-icon="i-lucide-external-link"
      class="ml-auto"
      :class="{ 'text-primary/50': article.isRead }"
      :loading
      @click="handleReadArticle"
    />
  </UPageCard>
</template>
