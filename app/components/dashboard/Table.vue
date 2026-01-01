<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'

const { tasks, status } = useTasks({ sortBy: 'createdAt', descending: true })

const data = computed(() => tasks.value || [])
const columns: TableColumn<Task>[] = [
  {
    header: 'Tâche',
    accessorKey: 'content'
  },
  {
    header: 'Statut',
    accessorKey: 'isDone',
    cell: ({ row }) =>
      h(resolveComponent('UBadge'), {
        color: row.original.isDone ? 'success' : 'warning',
        variant: 'soft',
        label: row.original.isDone ? 'Terminée' : 'À faire'
      })
  },
  {
    header: 'Date limite',
    accessorKey: 'deadline',
    cell: ({ row }) =>
      row.original.deadline ? new Date(row.original.deadline).toLocaleDateString() : 'Aucune'
  },
  {
    header: 'Créée le',
    accessorKey: 'createdAt',
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString()
  },
  {
    header: 'Actions',
    cell: ({ row }) =>
      h(
        resolveComponent('NuxtLink'),
        {
          label: 'Voir',
          to: `/tasks/${row.original.id}`
        },
        () =>
          h(resolveComponent('UButton'), {
            size: 'sm',
            variant: 'ghost',
            color: 'neutral',
            icon: 'i-lucide-move-right'
          })
      )
  }
]
</script>

<template>
  <UiTableBorderLess :data :columns :loading="isLoading(status)" />
</template>
