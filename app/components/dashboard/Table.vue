<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'

const data = ref<Task[]>([])
const columns: TableColumn<Task>[] = [
  {
    header: 'Tâche',
    accessorKey: 'content'
  },
  {
    header: 'Statut',
    accessorKey: 'isDone',
    cell: ({ row }) =>
      h(resolveComponent('UiBadge'), {
        variant: row.original.isDone ? 'success' : 'warning',
        label: row.original.isDone ? 'Terminée' : 'En cours'
      })
  },
  {
    header: 'Date limite',
    accessorKey: 'deadline',
    cell: ({ row }) =>
      row.original.deadline ? new Date(row.original.deadline).toLocaleDateString() : 'Aucune'
  }
]
</script>

<template>
  <UiTableBorderLess :data :columns />
</template>
