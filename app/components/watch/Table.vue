<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Pagination, RssSource } from '~~/shared/types'

const pagination = defineModel<Pagination>('pagination', { required: true })

defineProps<{
  loading: boolean
  sources: RssSource[]
  total: number
}>()

const columns = ref<TableColumn<RssSource>[]>([
  {
    header: 'Nom',
    accessorKey: 'name'
  },
  {
    header: 'Lien',
    accessorKey: 'url'
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
</script>

<template>
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
</template>
