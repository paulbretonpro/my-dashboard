<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { RssSource } from '~~/shared/types'

const pagination = ref({
  page: 1,
  perPage: 10
})

const { data, status, refresh } = useLazyFetch<PaginatedResponse<RssSource>>('/api/rss', {
  query: {
    page: pagination.value.page,
    perPage: pagination.value.perPage
  }
})

const sources = computed(() => data.value?.data || [])
const total = computed(() => data.value?.total || 0)

const loading = computed(() => isLoading(status.value))

const columns = ref<TableColumn<RssSource>[]>([
  {
    header: 'Nom',
    accessorKey: 'name'
  },
  {
    header: 'Lien',
    accessorKey: 'url',
    meta: {
      class: {
        td: 'max-w-80 whitespace-break-spaces'
      }
    }
  },
  {
    header: 'Actif',
    accessorKey: 'isActive',
    cell: ({ row }) =>
      h(resolveComponent('UBadge'), {
        color: row.original.isActive ? 'success' : 'error',
        variant: 'soft',
        label: row.original.isActive ? 'Active' : 'Inactive'
      })
  },
  {
    header: 'Dernière mise à jour',
    accessorKey: 'lastFetchedAt',
    cell: ({ row }) =>
      row.original.lastFetchedAt
        ? new Date(row.original.lastFetchedAt).toLocaleDateString()
        : 'Jamais'
  }
])

defineExpose({
  refresh
})
</script>

<template>
  <div>
    <UiTableBorderLess :data="sources" :columns :loading />
    <UPagination
      v-model:page="pagination.page"
      active-variant="outline"
      show-edges
      :items-per-page="pagination.perPage"
      :show-controls="false"
      :sibling-count="1"
      :total
      :ui="{ list: 'justify-end', item: 'ring-0', ellipsis: 'ring-0' }"
    />
  </div>
</template>
