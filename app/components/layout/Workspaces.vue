<script setup async lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import type { Workspace } from 'hub:db:schema'

const { data: workspaces, status } = await useLazyFetch<Workspace[]>('/api/workspaces', {
  server: false,
  default: () => []
})

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
      to: `/workspaces/${workspace.id}`
    }))
  )

  return base
})
</script>

<template>
  <UNavigationMenu :items orientation="vertical" />
</template>
