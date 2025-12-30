<script setup async lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

// const { data: workspaces, status } = await useLazyFetch<WorkspaceWithPages[]>('/api/workspaces', {
//   server: false,
//   default: () => []
// })

const workspaces = ref([])
const status = ref('success')

const items = computed<NavigationMenuItem[]>(() => {
  const base: NavigationMenuItem[] = [
    {
      type: 'label',
      label: 'Workspaces'
    }
  ]

  if (isLoading(status.value)) {
    base.push({
      label: 'Chargement...',
      disabled: true
    })
    return base
  }

  if (!workspaces.value?.length) {
    base.push({
      label: 'Aucun workspace',
      disabled: true
    })
    return base
  }

  base.push(
    ...workspaces.value.map((workspace) => ({
      label: workspace.name,
      to: `/pages/${workspace.id}`,
      children: workspace.pages.map((page) => ({
        label: page.name,
        to: `/pages/${page.id}`
      }))
    }))
  )

  return base
})
</script>

<template>
  <UNavigationMenu :items orientation="vertical" />
</template>
