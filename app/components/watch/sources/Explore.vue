<script setup lang="ts">
import type { PaginatedResponse, RssSource } from '~~/shared/types'

interface RssSourceWithSubscription extends RssSource {
  isSubscribed: boolean
}

const loading = ref(true)

const pagination = ref({
  page: 1,
  perPage: 10
})

const total = ref(0)

const { setLayoutLoading } = useLayoutStore()

const sources = ref<RssSourceWithSubscription[]>([])

const handleGetRssSources = async () => {
  loading.value = true
  try {
    const { data, total: count } = await $fetch<PaginatedResponse<RssSourceWithSubscription>>(
      '/api/explore/sources',
      {
        query: {
          page: pagination.value.page,
          perPage: pagination.value.perPage
        }
      }
    )
    sources.value = data
    total.value = count
  } finally {
    loading.value = false
  }
}

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

onMounted(handleGetRssSources)
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

    <UPagination
      v-model:page="pagination.page"
      active-variant="outline"
      show-edges
      :items-per-page="pagination.perPage"
      :show-controls="false"
      :sibling-count="1"
      :total
      :ui="{ list: 'justify-end', item: 'ring-0', ellipsis: 'ring-0' }"
      @update:page="handleGetRssSources"
    />
  </div>
</template>
