<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { AppFetchKeysEnum } from '~~/shared/types'

defineProps<{
  collapsed?: boolean
}>()

const { data: pages, status } = await useLazyFetch<PageWithChildren[]>('/api/pages', {
  key: AppFetchKeysEnum.PAGES,
  server: false,
  default: () => []
})

const favoritePages = computed(() => pages.value.filter((page) => page.isFavorite))
const otherPages = computed(() => pages.value.filter((page) => !page.isFavorite))

/**
 * Crée des items de menu pour un groupe de pages
 */
const buildMenuItems = (label: string, pagesGroup: PageWithChildren[]): NavigationMenuItem[] => {
  const base: NavigationMenuItem[] = [{ type: 'label', label }]

  if (isLoading(status.value)) {
    base.push({ label: 'Chargement...', disabled: true })
    return base
  }

  if (!pagesGroup.length) {
    base.push({
      label: label === 'Favoris' ? 'Aucun favori' : 'Aucune autre page',
      disabled: true
    })
    return base
  }

  base.push(
    ...pagesGroup.map((page) => ({
      label: page.name,
      to: page.parentId === null ? `/pages/${page.id}` : undefined,
      children:
        page.children?.map((child: Page) => ({
          label: child.name,
          to: `/pages/${child.id}`
        })) || []
    }))
  )

  return base
}

const itemsFavorites = computed(() => buildMenuItems('Favoris', favoritePages.value))
const itemsOthers = computed(() => buildMenuItems('Pages', otherPages.value))
</script>

<template>
  <UNavigationMenu :collapsed :items="[...itemsFavorites, ...itemsOthers]" orientation="vertical" />
</template>
