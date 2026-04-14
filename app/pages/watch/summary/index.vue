<script setup lang="ts">
const pagination = ref({
  page: 1,
  perPage: 10
})
const total = ref(0)
const loading = ref(true)
const loadingCreateSummary = ref(false)
const summary = ref<Summary[]>([])

const toast = useToast()

const handleFetchSummary = async () => {
  loading.value = true
  try {
    const { data, total: newTotal } = await $fetch<PaginatedResponse<Summary>>('/api/summary', {
      query: {
        page: pagination.value.page,
        perPage: pagination.value.perPage
      }
    })

    total.value = newTotal
    summary.value = data
  } finally {
    loading.value = false
  }
}

const handleUpdatePagination = (newPage: number) => {
  pagination.value.page = newPage
  handleFetchSummary()
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

onMounted(handleFetchSummary)
</script>

<template>
  <div class="flex flex-col gap-6 w-full lg:max-w-5xl mx-auto">
    <UPageCard
      title="Liste des résumés"
      description="Tous les résumés de vos veilles."
      variant="naked"
      orientation="horizontal"
    >
      <UButton
        :loading="loadingCreateSummary"
        label="Ajouter"
        icon="i-lucide-plus"
        class="ml-auto"
        @click="handleCreateSummary"
      />
    </UPageCard>

    <WatchSummaryList
      :summary
      :loading
      :total
      :pagination
      @update:pagination="handleUpdatePagination"
    />
  </div>
</template>
