<script setup lang="ts" generic="T">
import type { TableColumn } from '@nuxt/ui'

defineProps<{
  data: T[]
  columns: TableColumn<T>[]
  loading?: boolean
}>()
</script>

<template>
  <UTable
    :data
    :columns
    :loading
    class="shrink-0"
    :ui="{
      base: 'table-fixed border-separate border-spacing-0',
      thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
      tbody: '[&>tr]:last:[&>td]:border-b-0',
      th: 'first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
      td: 'border-b border-default'
    }"
  />
</template>
