<script setup lang="ts">
import type { PaginatedResponse, RssSource } from '~~/shared/types'

interface RssSourceWithSubscription extends RssSource {
  isSubscribed: boolean
}

const { setLayoutLoading } = useLayoutStore()

const sources = ref<RssSourceWithSubscription[]>([])

const handleSubcribeUserToSource = async (source: RssSourceWithSubscription) => {
  if (!source) return

  try {
    setLayoutLoading(true)
    if (source.isSubscribed) {
      await $fetch(`/api/rss/${source.id}`, {
        method: 'DELETE'
      })
      source.isSubscribed = false
    } else {
      await $fetch(`/api/rss/${source.id}`, {
        method: 'POST'
      })
      source.isSubscribed = true
    }
  } finally {
    setLayoutLoading(false)
  }
}

onMounted(async () => {
  const response =
    await $fetch<PaginatedResponse<RssSourceWithSubscription>>('/api/explore/sources')
  sources.value = response.data
})
</script>

<template>
  <div>
    <div class="space-y-4">
      <UCard v-for="source in sources" :key="source.id">
        <div class="flex justify-between items-center">
          <div>
            <div class="font-medium text-lg">{{ source.name }}</div>
            <NuxtLink :to="source.url" external target="_blank">
              <div class="text-sm text-gray-500 break-words">{{ source.url }}</div>
            </NuxtLink>
          </div>
          <div class="flex gap-4">
            <NuxtLink v-if="source.siteUrl" :to="source.siteUrl" external target="_blank">
              <UButton icon="i-lucide-external-link" variant="ghost" />
            </NuxtLink>

            <UButton
              :label="source.isSubscribed ? 'Se désabonner' : 'Suivre'"
              :icon="source.isSubscribed ? 'i-lucide-trash' : 'i-lucide-bell-plus'"
              size="sm"
              variant="subtle"
              :color="source.isSubscribed ? 'error' : 'primary'"
              @click="handleSubcribeUserToSource(source)"
            />
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
