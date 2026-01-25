<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'

const { setLayout } = useLayoutStore()

setLayout({
  title: 'Sources RSS'
})

const items = [
  {
    label: 'Mes sources',
    icon: 'i-lucide-user',
    slot: 'my-sources' as const
  },
  {
    label: 'Explorer',
    icon: 'i-lucide-search',
    slot: 'explore' as const
  }
] satisfies TabsItem[]

const sourcesRef = ref()

const handleRefresh = () => {
  sourcesRef.value?.refresh()
}
</script>

<template>
  <div class="flex flex-col gap-6 w-full lg:max-w-2xl mx-auto">
    <UPageCard
      title="Sources RSS"
      description="Gérer les sources RSS."
      variant="naked"
      orientation="horizontal"
    >
      <template #default>
        <div class="space-x-4 ml-auto">
          <WatchSourcesAdd />
        </div>
      </template>
    </UPageCard>

    <UTabs :items variant="link" :ui="{ trigger: 'grow' }" class="gap-4 w-full">
      <template #my-sources>
        <WatchSources ref="sourcesRef" />
      </template>

      <template #explore>
        <WatchSourcesExplore />
      </template>
    </UTabs>
  </div>
</template>
