<script setup lang="ts">
import type { EditorEvents } from '@tiptap/vue-3'

const { setLayout } = useLayoutStore()

const toast = useToast()

const { summary, summaryId, getSummary, loading, error } = useSummary()

const handleUpdateSummary = async ({ editor, title }: EditorEvents['blur'] & { title: string }) => {
  try {
    await $fetch(`/api/summary/${summaryId}`, {
      method: 'PUT',
      body: {
        content: editor.getHTML(),
        title
      }
    })
  } catch {
    toast.add({
      title: 'Erreur',
      description: 'Une erreur est survenue lors de la mise à jour du résumé.',
      color: 'error'
    })
  }
}

onMounted(async () => {
  await getSummary()

  setLayout({
    title: summary.value?.title
  })
})
</script>

<template>
  <UEmpty
    v-if="loading"
    icon="i-lucide-file-text"
    title="Chargement..."
    description="Si le chargement est trop long, tu as le temps pour un café "
  />

  <UEmpty
    v-else-if="error"
    icon="i-lucide-alert-triangle"
    title="Erreur"
    description="Une erreur est survenue lors du chargement du résumé."
    class="mx-auto"
  />

  <div v-if="summary" class="lg:max-w-7xl mx-auto w-full space-y-6">
    <WatchSummaryCardRelatedArticles :summary @link-added="getSummary" />

    <div
      class="flex justify-center p-4 relative h-svh overflow-y-auto !p-0 rounded-b-md rounded-t-md"
    >
      <WatchSummaryEditor v-model="summary" @onBlur="handleUpdateSummary" />
    </div>
  </div>
</template>
