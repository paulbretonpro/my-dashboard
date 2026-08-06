<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { refDebounced } from '@vueuse/core'
import type { PaginatedResponse, RssSource } from '~~/shared/types'

interface RssSourceWithSubscription extends RssSource {
  isSubscribed: boolean
}

interface SearchResultFeed {
  name: string
  url: string
  siteUrl: string | null
  description: string | null
  subscribers: number
  iconUrl: string | null
  id?: number // Database source ID once subscribed
  isSubscribed?: boolean
}

const loading = ref(false)
const searchTerm = ref('')
const searchTermDebounced = refDebounced(searchTerm, 400)

const pagination = ref({
  page: 1,
  perPage: 10
})

const total = ref(0)
const { setLayoutLoading } = useLayoutStore()

// Local database active, unsubscribed catalog
const localSources = ref<RssSourceWithSubscription[]>([])

// Global search results from Feedly
const globalSources = ref<SearchResultFeed[]>([])

const handleGetLocalRssSources = async () => {
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
    localSources.value = data
    total.value = count
  } catch (error) {
    console.error('Failed to load local RSS catalog:', error)
  } finally {
    loading.value = false
  }
}

const handleGlobalSearch = async (q: string) => {
  loading.value = true
  try {
    const data = await $fetch<SearchResultFeed[]>('/api/rss/search', {
      query: { q }
    })
    // Initialize subscription state
    globalSources.value = data.map(item => ({
      ...item,
      isSubscribed: false
    }))
  } catch (error) {
    console.error('Failed global RSS search:', error)
    globalSources.value = []
  } finally {
    loading.value = false
  }
}

// Watch search term to toggle between local catalogue and global search
watch(searchTermDebounced, async (newVal) => {
  pagination.value.page = 1
  if (newVal && newVal.trim().length >= 2) {
    await handleGlobalSearch(newVal.trim())
  } else {
    globalSources.value = []
    await handleGetLocalRssSources()
  }
})

// Handles subscribing to local database source
const handleSubscribeLocalSource = async (source: RssSourceWithSubscription) => {
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
  } catch (error) {
    console.error('Subscription change failed:', error)
  } finally {
    setLayoutLoading(false)
  }
}

// Handles subscribing to a newly discovered Feedly global source
const handleSubscribeGlobalSource = async (source: SearchResultFeed) => {
  if (!source) return
  try {
    setLayoutLoading(true)
    if (source.isSubscribed && source.id) {
      // Unsubscribe using the saved source ID
      await $fetch(`/api/rss/${source.id}`, {
        method: 'DELETE'
      })
      source.isSubscribed = false
    } else {
      // Subscribe / register source
      const result = await $fetch<{ success: boolean; sourceId: number }>('/api/rss/subscribe', {
        method: 'POST',
        body: {
          url: source.url,
          name: source.name,
          siteUrl: source.siteUrl || undefined
        }
      })
      if (result.success) {
        source.id = result.sourceId
        source.isSubscribed = true
      }
    }
  } catch (error) {
    console.error('Global subscription failed:', error)
  } finally {
    setLayoutLoading(false)
  }
}

const formatSubscribers = (count: number) => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M abonnés`
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(0)}k abonnés`
  }
  return `${count} abonnés`
}

onMounted(() => {
  handleGetLocalRssSources()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Barre de recherche unifiée -->
    <UInput
      v-model="searchTerm"
      placeholder="Rechercher des flux RSS sur tout le web (par mot-clé, #thème ou URL)..."
      icon="i-lucide-search"
      size="md"
      class="w-full"
      :loading="loading"
      is-clearable
    />

    <!-- État Chargement initial -->
    <div v-if="loading && localSources.length === 0 && globalSources.length === 0" class="space-y-4">
      <div v-for="n in 3" :key="n" class="p-5 border border-default bg-elevated/20 rounded-xl space-y-3 animate-pulse">
        <div class="flex items-center justify-between">
          <div class="space-y-2 flex-1">
            <div class="h-4 bg-elevated rounded w-1/3" />
            <div class="h-3 bg-elevated rounded w-2/3" />
          </div>
          <div class="w-24 h-8 bg-elevated rounded" />
        </div>
      </div>
    </div>

    <!-- Mode Global Search (Feedly results) -->
    <div v-else-if="searchTermDebounced.trim().length >= 2" class="space-y-4">
      <div class="text-xs text-muted font-semibold uppercase tracking-wider flex items-center gap-1.5 px-1">
        <UIcon name="i-lucide-globe" />
        Résultats de recherche sur le web
      </div>

      <div v-if="globalSources.length === 0" class="text-center py-12 border border-dashed border-default rounded-xl bg-elevated/10">
        <UIcon name="i-lucide-rss" class="text-3xl text-muted mx-auto mb-2" />
        <p class="text-sm font-medium text-highlighted">Aucun flux RSS trouvé sur le web</p>
        <p class="text-xs text-muted mt-1">Essayez un autre mot-clé ou tapez directement l'URL d'un site.</p>
      </div>

      <div v-else class="space-y-4 animate-fade-in">
        <UCard
          v-for="source in globalSources"
          :key="source.url"
          class="hover:bg-elevated/25 transition-colors"
          :ui="{ body: 'p-4 sm:p-5' }"
        >
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div class="flex gap-3 min-w-0 flex-1">
              <UAvatar
                :src="source.iconUrl || undefined"
                :alt="source.name"
                size="md"
                class="border border-default bg-muted shrink-0 mt-0.5"
                icon="i-lucide-rss"
              />
              <div class="min-w-0 flex-1 space-y-1">
                <div class="flex items-center flex-wrap gap-2">
                  <span class="font-semibold text-highlighted text-sm sm:text-base leading-none">
                    {{ source.name }}
                  </span>
                  <UBadge v-if="source.subscribers" color="neutral" variant="subtle" size="sm" class="text-[10px]">
                    {{ formatSubscribers(source.subscribers) }}
                  </UBadge>
                </div>
                <div class="text-xs text-muted leading-tight line-clamp-2" :title="source.description || ''">
                  {{ source.description || 'Pas de description disponible.' }}
                </div>
                <div class="flex items-center gap-1.5 text-[11px] text-muted truncate">
                  <span class="font-mono text-primary/80 shrink-0">Flux XML :</span>
                  <span class="truncate hover:underline cursor-pointer" :title="source.url">
                    {{ source.url }}
                  </span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-2 self-end sm:self-center shrink-0">
              <NuxtLink v-if="source.siteUrl" :to="source.siteUrl" external target="_blank">
                <UButton icon="i-lucide-external-link" variant="ghost" size="sm" title="Visiter le site" />
              </NuxtLink>

              <UButton
                :label="source.isSubscribed ? 'Suivi' : 'Suivre'"
                :icon="source.isSubscribed ? 'i-lucide-check' : 'i-lucide-bell-plus'"
                size="sm"
                variant="subtle"
                :color="source.isSubscribed ? 'success' : 'primary'"
                @click="handleSubscribeGlobalSource(source)"
              />
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Mode Local Catalogue -->
    <div v-else class="space-y-4">
      <div class="text-xs text-muted font-semibold uppercase tracking-wider flex items-center gap-1.5 px-1">
        <UIcon name="i-lucide-library" />
        Catalogue de sources recommandées
      </div>

      <div v-if="localSources.length === 0" class="text-center py-12 border border-dashed border-default rounded-xl bg-elevated/10">
        <UIcon name="i-lucide-folder-open" class="text-3xl text-muted mx-auto mb-2" />
        <p class="text-sm font-medium text-highlighted">Catalogue vide</p>
        <p class="text-xs text-muted mt-1">Toutes les sources recommandées ont déjà été suivies !</p>
      </div>

      <div v-else class="space-y-4">
        <UCard
          v-for="source in localSources"
          :key="source.id"
          class="hover:bg-elevated/25 transition-colors"
          :ui="{ body: 'p-4 sm:p-5' }"
        >
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div class="min-w-0 flex-1 space-y-1">
              <div class="font-semibold text-highlighted text-sm sm:text-base leading-none">
                {{ source.name }}
              </div>
              <div class="text-xs text-muted truncate">
                {{ source.url }}
              </div>
            </div>
            <div class="flex items-center gap-2 self-end sm:self-center shrink-0">
              <NuxtLink v-if="source.siteUrl" :to="source.siteUrl" external target="_blank">
                <UButton icon="i-lucide-external-link" variant="ghost" size="sm" title="Visiter le site" />
              </NuxtLink>

              <UButton
                :label="source.isSubscribed ? 'Se désabonner' : 'Suivre'"
                :icon="source.isSubscribed ? 'i-lucide-trash' : 'i-lucide-bell-plus'"
                size="sm"
                variant="subtle"
                :color="source.isSubscribed ? 'error' : 'primary'"
                @click="handleSubscribeLocalSource(source)"
              />
            </div>
          </div>
        </UCard>

        <!-- Pagination (uniquement pour le catalogue local) -->
        <UPagination
          v-model:page="pagination.page"
          active-variant="outline"
          show-edges
          :items-per-page="pagination.perPage"
          :show-controls="false"
          :sibling-count="1"
          :total
          :ui="{ list: 'justify-end', item: 'ring-0', ellipsis: 'ring-0' }"
          @update:page="handleGetLocalRssSources"
        />
      </div>
    </div>
  </div>
</template>
