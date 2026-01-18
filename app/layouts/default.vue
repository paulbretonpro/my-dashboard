<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const { tasks, updateSearch } = useTasks({
  immediate: false,
  perPage: 10
})

const open = ref(false)

const links = [
  [
    {
      label: 'Home',
      icon: 'i-lucide-house',
      to: '/',
      onSelect: () => {
        open.value = false
      }
    },
    {
      label: 'Bloc notes',
      icon: 'i-lucide-list',
      to: '/notes',
      onSelect: () => {
        open.value = false
      }
    },
    {
      label: 'Veille',
      icon: 'i-lucide-eye',
      children: [
        {
          label: 'Articles',
          to: '/watch/articles',
          onSelect: () => {
            open.value = false
          }
        },
        {
          label: 'Sources',
          to: '/watch/sources',
          onSelect: () => {
            open.value = false
          }
        }
      ]
    }
  ]
] satisfies NavigationMenuItem[][]

const groups = computed(() => [
  {
    id: 'tasks',
    label: 'Tâches',
    items: tasks.value.map((task) => ({
      label: task.content,
      icon: 'i-lucide-check-square',
      to: `/tasks/${task.id}`,
      onSelect: () => {
        open.value = false
      }
    }))
  },
  {
    id: 'links',
    label: 'Go to',
    items: links.flat()
  }
])
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #header="{ collapsed }">
        <TeamsMenu :collapsed />
      </template>

      <template #default="{ collapsed }">
        <UDashboardSearchButton :collapsed class="bg-transparent ring-default" />

        <UNavigationMenu :collapsed :items="links[0]" orientation="vertical" tooltip popover />

        <LayoutPageMenu :collapsed />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed />
      </template>
    </UDashboardSidebar>

    <UDashboardSearch
      placeholder="Rechercher une page ou une tâche"
      :groups
      @update:search-term="updateSearch"
    />

    <slot />

    <NotificationsSlideover />
  </UDashboardGroup>
</template>
