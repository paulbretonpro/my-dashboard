<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  trackedRepos?: any[] | null
  followRepo: (fullName: string) => Promise<void>
}>()

const page = ref(1)
const perPage = 6
const allPopularRepos = ref<any[]>([])
const hasMore = ref(true)

// Charger les dépôts populaires avec pagination côté serveur
const { data: popularRepos, pending, error } = useFetch('/api/github/popular', {
  params: { page, perPage },
  headers: useRequestHeaders(['cookie']),
  watch: [page]
})

// Accumuler les résultats pour faire du "Load More"
watch(popularRepos, (newVal) => {
  if (newVal) {
    if (page.value === 1) {
      allPopularRepos.value = newVal
    } else {
      // Éviter les doublons
      const existingFullNames = new Set(allPopularRepos.value.map(r => r.fullName.toLowerCase()))
      const uniques = newVal.filter((r: any) => !existingFullNames.has(r.fullName.toLowerCase()))
      allPopularRepos.value.push(...uniques)
    }

    // S'il y a moins de résultats que demandé par page, on est à la fin
    if (newVal.length < perPage) {
      hasMore.value = false
    } else {
      hasMore.value = true
    }
  }
}, { immediate: true })

const followingMap = ref<Record<string, boolean>>({})

const showMore = () => {
  if (pending.value) return
  page.value += 1
}

const handleFollow = async (fullName: string) => {
  followingMap.value[fullName] = true
  try {
    await props.followRepo(fullName)
  } finally {
    followingMap.value[fullName] = false
  }
}

// Vérifier si un dépôt est déjà suivi
const isTracked = (fullName: string) => {
  if (!props.trackedRepos) return false
  return props.trackedRepos.some(
    (r) => r.fullName.toLowerCase() === fullName.toLowerCase()
  )
}

const formatStars = (stars: number) => {
  if (stars >= 1000) {
    return `${(stars / 1000).toFixed(1)}k`
  }
  return stars.toString()
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center gap-2">
      <UIcon name="i-lucide-compass" class="text-primary text-xl" />
      <h3 class="font-bold text-highlighted text-lg">Dépôts populaires en ce moment</h3>
    </div>

    <!-- Chargement Initial -->
    <div v-if="pending && page === 1 && (!allPopularRepos || allPopularRepos.length === 0)" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="n in 3" :key="n" class="p-4 border border-default bg-elevated/10 rounded-xl space-y-3 animate-pulse">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 bg-elevated rounded-full" />
          <div class="h-4 bg-elevated rounded w-1/2" />
        </div>
        <div class="h-3 bg-elevated rounded w-full" />
        <div class="h-3 bg-elevated rounded w-5/6" />
        <div class="flex justify-between items-center pt-2">
          <div class="w-16 h-4 bg-elevated rounded" />
          <div class="w-14 h-7 bg-elevated rounded" />
        </div>
      </div>
    </div>

    <!-- Erreur -->
    <div v-else-if="error" class="p-4 border border-dashed border-red-500/30 rounded-xl bg-red-500/5 text-center text-xs text-red-500">
      Impossible de charger les dépôts populaires pour le moment.
    </div>

    <!-- Liste de dépôts populaires -->
    <div v-else class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" v-auto-animate>
        <div
          v-for="repo in allPopularRepos"
          :key="repo.fullName"
          class="p-4 border border-default bg-elevated/20 hover:bg-elevated/45 rounded-xl transition-all flex flex-col justify-between gap-3 group relative"
        >
          <div class="space-y-2">
            <!-- En-tête : Avatar et Nom -->
            <div class="flex items-center gap-2.5">
              <UAvatar
                :src="repo.avatarUrl || 'https://github.com/github.png'"
                :alt="repo.owner"
                size="sm"
                class="border border-default bg-muted"
              />
              <div class="min-w-0 flex-1">
                <NuxtLink
                  :to="repo.htmlUrl"
                  target="_blank"
                  class="font-semibold text-highlighted hover:text-primary transition-colors text-xs truncate flex items-center gap-1"
                >
                  {{ repo.fullName }}
                  <UIcon name="i-lucide-external-link" class="text-[9px] text-muted group-hover:text-primary transition-colors" />
                </NuxtLink>
              </div>
            </div>

            <!-- Description -->
            <p class="text-[11px] text-muted line-clamp-2 h-8">
              {{ repo.description || 'Aucune description disponible' }}
            </p>
          </div>

          <!-- Stats et Action -->
          <div class="flex items-center justify-between border-t border-default/50 pt-2.5 mt-1">
            <!-- Stats -->
            <div class="flex items-center gap-3 text-[11px] text-muted font-medium">
              <div class="flex items-center gap-1" title="Stars">
                <UIcon name="i-lucide-star" class="text-amber-500" />
                <span>{{ formatStars(repo.stars) }}</span>
              </div>
              <div class="flex items-center gap-1" title="Forks">
                <UIcon name="i-lucide-git-fork" class="text-blue-500" />
                <span>{{ formatStars(repo.forks) }}</span>
              </div>
            </div>

            <!-- Action -->
            <UButton
              v-if="!isTracked(repo.fullName)"
              label="Suivre"
              icon="i-lucide-plus"
              size="xs"
              variant="ghost"
              :loading="followingMap[repo.fullName]"
              @click="handleFollow(repo.fullName)"
            />
            <UButton
              v-else
              label="Suivi"
              icon="i-lucide-check"
              size="xs"
              color="success"
              variant="soft"
              disabled
            />
          </div>
        </div>
      </div>

      <!-- Bouton Voir Plus -->
      <div v-if="hasMore" class="flex justify-center pt-2">
        <UButton
          label="Voir plus"
          icon="i-lucide-chevron-down"
          color="neutral"
          variant="subtle"
          size="md"
          :loading="pending"
          @click="showMore"
        />
      </div>
    </div>
  </div>
</template>
