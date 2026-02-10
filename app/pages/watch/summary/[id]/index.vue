<script setup lang="ts">
import { WatchSummaryActionsSummary } from '#components'

const { setLayout } = useLayoutStore()

const { getSummary, summary, summaryId, loading, error } = useSummary()

setLayout({
  actions: () =>
    h(WatchSummaryActionsSummary, {
      onDelete: () => {
        const toast = useToast()
        toast.add({
          title: 'Suppression du résumé',
          description: "Cette fonctionnalité n'est pas encore disponible.",
          color: 'info'
        })
      },
      onEdit: () => {
        navigateTo(`/watch/summary/${summaryId}/edit`)
      }
    })
})

onMounted(getSummary)
</script>

<template>
  <div class="w-full lg:max-w-7xl mx-auto space-y-6">
    <UEmpty
      v-if="loading"
      icon="i-lucide-folder-open"
      title="Chargement..."
      description="Si le chargement est trop long, tu as le temps pour un café "
    />
    <template v-else>
      <UEmpty
        v-if="error"
        icon="i-lucide-alert-triangle"
        title="Erreur"
        description="Une erreur est survenue lors du chargement du résumé."
        class="mx-auto"
      />

      <WatchSummaryCardRelatedArticles v-if="summary" :summary />
      <UEditor
        ref="editorRef"
        :model-value="summary?.content"
        content-type="html"
        :editable="false"
      />
    </template>
  </div>
</template>
