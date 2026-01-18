<script setup lang="ts">
import type { PaginatedResponse, RssSource } from '~~/shared/types'

const pagination = ref({
  page: 1,
  perPage: 10
})

const { data, status } = await useLazyFetch<PaginatedResponse<RssSource>>('/api/rss', {
  query: {
    page: pagination.value.page,
    perPage: pagination.value.perPage
  }
})

const sources = computed(() => data.value?.data || [])
const total = computed(() => data.value?.total || 0)

const loading = computed(() => isLoading(status.value))
</script>

<template>
  <UDashboardPanel :ui="{ body: 'lg:py-12' }">
    <template #header>
      <UDashboardNavbar title="Veille technologique">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-col gap-6 w-full lg:max-w-2xl mx-auto">
        <UPageCard
          title="Veille technologique"
          description="Gérer les sources RSS."
          variant="naked"
          orientation="horizontal"
        />

        <WatchTable v-model:pagination="pagination" :sources :loading :total />
      </div>
    </template>
  </UDashboardPanel>
</template>
