<script setup lang="ts">
const loadingCreateSummary = ref(false)

const toast = useToast()

const handleFetchSummary = async (options: {
  page: number
  perPage: number
}): Promise<PaginatedResponse<Summary> | undefined> => {
  try {
    const response = await $fetch<PaginatedResponse<Summary>>('/api/summary', {
      query: {
        page: options.page,
        perPage: options.perPage
      }
    })

    return response
  } catch {
    toast.add({
      title: 'Erreur',
      description: 'Impossible de charger les résumés, réessaie plus tard.',
      color: 'error'
    })
  }
}

const handleCreateSummary = async () => {
  loadingCreateSummary.value = true
  try {
    const summary = await $fetch<Summary>('/api/summary', {
      method: 'POST',
      body: {
        content: DEFAULT_SUMMARY_CONTENT,
        title: DEFAULT_SUMMARY_TITLE
      }
    })

    await navigateTo(`/watch/summary/${summary.id}/edit`)
  } catch {
    toast.add({
      title: 'Erreur',
      description: 'Impossible de créer un nouveau résumé.',
      color: 'error'
    })
  } finally {
    loadingCreateSummary.value = false
  }
}
</script>

<template>
  <SharedPage
    title="Liste des résumés"
    description="Tous les résumés de vos veilles."
    create-path="/watch/summary"
    empty-message="Aucun résumé trouvé"
    icon="i-lucide-folder-open"
    :fetch-fn="handleFetchSummary"
    :create-fn="handleCreateSummary"
  >
    <template #default="{ items }">
      <UPageColumns>
        <UCard
          v-for="item in items"
          :key="item.id"
          variant="subtle"
          @click="navigateTo(`/watch/summary/${item.id}`)"
          class="hover:cursor-pointer"
        >
          <div class="flex items-center justify-between gap-4 mb-4">
            <div>{{ item.title }}</div>
            <UButton color="neutral" variant="subtle" icon="i-lucide-arrow-right" />
          </div>
          <div class="text-sm text-muted">
            {{ new Date(item.createdAt).toLocaleDateString() }}
          </div>
        </UCard>
      </UPageColumns>
    </template>
  </SharedPage>
</template>
