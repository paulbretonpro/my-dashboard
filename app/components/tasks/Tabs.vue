<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'

const items = ref<TabsItem[]>([
  {
    label: "Aujourd'hui",
    slot: 'today'
  },
  {
    label: 'Historique',
    slot: 'history'
  }
])
</script>

<template>
  <UTabs variant="link" color="neutral" :items class="w-full" :ui="{ content: 'py-4' }">
    <template #today>
      <TasksTabsToday />
    </template>

    <template #history>
      <TasksTabsHistory />
    </template>
  </UTabs>
</template>
