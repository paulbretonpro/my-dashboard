<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  repos?: any[] | null
  loading: boolean
}>()

defineEmits(['remove'])

// Mettre en avant (trier au début) les dépôts avec une nouvelle release
const sortedRepos = computed(() => {
  if (!props.repos) return []
  return [...props.repos].sort((a, b) => {
    if (a.isNewRelease && !b.isNewRelease) return -1
    if (!a.isNewRelease && b.isNewRelease) return 1
    return 0
  })
})
</script>

<template>
  <!-- Chargement -->
  <div v-if="loading && (!repos || repos.length === 0)" class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div v-for="n in 4" :key="n" class="p-5 border border-default bg-elevated/20 rounded-xl space-y-4 animate-pulse">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-elevated rounded-full" />
        <div class="space-y-2 flex-1">
          <div class="h-4 bg-elevated rounded w-1/2" />
          <div class="h-3 bg-elevated rounded w-1/4" />
        </div>
      </div>
      <div class="h-3 bg-elevated rounded w-full" />
      <div class="h-3 bg-elevated rounded w-5/6" />
      <div class="border-t border-default pt-4 flex justify-between">
        <div class="flex gap-3">
          <div class="w-10 h-4 bg-elevated rounded" />
          <div class="w-10 h-4 bg-elevated rounded" />
        </div>
        <div class="w-12 h-6 bg-elevated rounded" />
      </div>
    </div>
  </div>

  <!-- Mode vide -->
  <div
    v-else-if="!repos || repos.length === 0"
    class="text-center py-16 border border-dashed border-default rounded-xl bg-elevated/20 space-y-3"
  >
    <UIcon name="i-simple-icons-github" class="text-4xl text-muted mx-auto" />
    <h4 class="font-semibold text-highlighted">Aucun dépôt GitHub suivi</h4>
    <p class="text-xs text-muted max-w-md mx-auto">
      Ajoutez un dépôt public (par exemple, "nuxt/nuxt" ou "vuejs/core") ci-dessus pour suivre son évolution.
    </p>
  </div>

  <!-- Liste des dépôts -->
  <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6" v-auto-animate>
    <WatchGithubCard
      v-for="repo in sortedRepos"
      :key="repo.id"
      :repo="repo"
      @remove="(id, fullName) => $emit('remove', id, fullName)"
    />
  </div>
</template>
