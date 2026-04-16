<script setup lang="ts">
import type { ArticlesWithSource, Summary } from '~~/shared/types'

const props = defineProps<{
  article: ArticlesWithSource
}>()

const isRead = computed(() => props.article.isRead ?? false)

const loading = ref(false)
const toast = useToast()

const handleReadArticle = async () => {
  loading.value = true

  try {
    if (isRead.value) {
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

const handleCreateSummary = async () => {
  try {
    const insertedSummary = await $fetch<Summary>('/api/summary', {
      method: 'POST',
      body: {
        articleId: props.article.id,
        content: DEFAULT_SUMMARY_CONTENT,
        title: DEFAULT_SUMMARY_TITLE,
        url: props.article.link
      }
    })

    navigateTo(`/watch/summary/${insertedSummary.id}/edit`)
  } catch {
    toast.add({
      title: 'Erreur',
      description: 'Une erreur est survenue lors de la création du résumé.',
      color: 'error'
    })
  }
}
</script>

<template>
  <UPageCard
    orientation="vertical"
    :variant="isRead ? 'outline' : 'subtle'"
    :ui="{ leading: 'w-full' }"
    class="hover:bg-elevated transition-all hover:cursor-pointer"
    @click="handleReadArticle"
  >
    <template #leading>
      <div class="w-full flex justify-between items-center gap-2">
        <UBadge :label="article.source.name" variant="soft" />
        <UBadge
          v-if="isRead"
          icon="i-lucide-eye"
          label="Lu"
          color="neutral"
          variant="soft"
          size="sm"
        />
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

    <div class="flex justify-between">
      <UButton
        label="Résumé"
        color="neutral"
        variant="soft"
        block
        icon="i-lucide-folder-plus"
        class="w-fit ml-auto"
        @click.stop="handleCreateSummary"
      />
    </div>
  </UPageCard>
</template>
