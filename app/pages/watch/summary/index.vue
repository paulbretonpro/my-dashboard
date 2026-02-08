<script setup lang="ts">
const pagination = ref({
  page: 1,
  perPage: 10
})
const total = ref(0)
const loading = ref(true)
const summary = ref<Summary[]>([])

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
        label="Ajouter"
        icon="i-lucide-plus"
        @click="navigateTo('/watch/summary/create')"
        class="ml-auto"
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
