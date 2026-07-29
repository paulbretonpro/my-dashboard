<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const { isMobile } = useDevice()

const { title, isLoading, actions } = storeToRefs(useLayoutStore())

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
      to: '/dashboard',
      onSelect: () => {
        open.value = false
      }
    },
    {
      label: 'Veille',
      type: 'label'
    },
    {
      label: 'Résumés',
      icon: 'i-lucide-folder-open',
      to: '/watch/summary',
      onSelect: () => {
        open.value = false
      }
    },
    {
      label: 'Articles',
      icon: 'i-lucide-file-text',
      to: '/watch/articles',
      onSelect: () => {
        open.value = false
      }
    },
    {
      label: 'Sources',
      icon: 'i-lucide-rss',
      to: '/watch/sources',
      onSelect: () => {
        open.value = false
      }
    },
    {
      label: 'GitHub',
      icon: 'i-simple-icons-github',
      to: '/watch/github',
      onSelect: () => {
        open.value = false
      }
    },
    {
      label: 'Roadmap',
      type: 'label'
    },
    {
      label: 'Sujets',
      icon: 'i-lucide-route',
      to: '/tasks',
      onSelect: () => {
        open.value = false
      }
    },
    {
      label: 'Notes',
      type: 'label'
    },
    {
      label: 'Bloc notes',
      icon: 'i-lucide-notebook-text',
      to: '/notes',
      onSelect: () => {
        open.value = false
      }
    }
  ]
] satisfies NavigationMenuItem[][]

const groups = computed(() => [
  {
    id: 'tasks',
    label: 'Sujets',
    items: tasks.value.map((task) => ({
      label: task.title,
      icon: 'i-lucide-route',
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
      <template #default="{ collapsed }">
        <UDashboardSearchButton :collapsed class="bg-transparent ring-default" />

        <UNavigationMenu
          :collapsed
          :items="links[0]"
          orientation="vertical"
          :ui="{ label: 'mt-4' }"
          tooltip
          popover
        />

        <!-- <LayoutPageMenu :collapsed /> -->
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

    <UDashboardPanel :ui="{ body: 'lg:py-12' }">
      <template #header>
        <UDashboardNavbar>
          <template #title v-if="!isMobile">
            <div class="font-semibold">
              <ClientOnly fallback="My dashboard">{{ title }}</ClientOnly>
            </div>
          </template>
          <template #leading>
            <UDashboardSidebarCollapse />
          </template>

          <template #right>
            <UButton v-if="isLoading" loading variant="ghost" color="neutral" size="md">
              Chargement...
            </UButton>

            <ClientOnly>
              <component v-if="actions" :is="actions" />
            </ClientOnly>
          </template>
        </UDashboardNavbar>
      </template>

      <template #body>
        <slot />
      </template>
    </UDashboardPanel>

    <NotificationsSlideover />
  </UDashboardGroup>
</template>
