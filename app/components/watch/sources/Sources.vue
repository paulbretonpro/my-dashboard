<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { RssSource } from '~~/shared/types'

const { setLayoutLoading } = useLayoutStore()

const { sources, total, pagination, loading, refresh } = useSources()

const columns = ref<TableColumn<RssSource>[]>([
  {
    header: 'Nom',
    accessorKey: 'name',
    cell: ({ row }) =>
      h('div', { class: 'flex flex-col gap-1' }, [
        h('div', { class: 'font-medium' }, row.original.name),
        h(
          resolveComponent('NuxtLink'),
          {
            class: 'text-xs text-muted-foreground',
            to: row.original.url,
            external: true,
            target: '_blank'
          },
          row.original.url
        )
      ])
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
  },
  {
    id: 'action',
    cell: ({ row }) =>
      h(resolveComponent('UButton'), {
        size: 'sm',
        variant: 'subtle',
        color: 'error',
        icon: 'i-lucide-trash',
        label: 'Se désabonner',
        onClick: () => handleSubscribeUserToSource(row.original)
      })
  }
])

const handleSubscribeUserToSource = async (source: RssSource) => {
  if (!source) return

  try {
    setLayoutLoading(true)
    await $fetch(`/api/rss/${source.id}`, {
      method: 'DELETE'
    })

    await refresh()
  } finally {
    setLayoutLoading(false)
  }
}

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
