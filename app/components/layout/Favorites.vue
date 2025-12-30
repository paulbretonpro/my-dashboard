<script setup async lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import type { Page } from 'hub:db:schema'

const { data: pages, status } = await useLazyFetch<Page[]>('/api/pages', {
  server: false,
  default: () => []
})

const items = computed<NavigationMenuItem[]>(() => {
  const base: NavigationMenuItem[] = [
    {
      type: 'label',
      label: 'Favoris'
    }
  ]

  if (isLoading(status.value)) {
    base.push({
      label: 'Chargement...',
      disabled: true
    })
    return base
  }

  if (!pages.value?.length) {
    base.push({
      label: 'Aucun favori',
      disabled: true
    })
    return base
  }

  base.push(
    ...pages.value.map((page) => ({
      label: page.name,
      to: `/pages/${page.id}`
    }))
  )

  return base
})
</script>

<template>
  <UNavigationMenu :items orientation="vertical" />
</template>
