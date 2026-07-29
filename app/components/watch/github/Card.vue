<script setup lang="ts">
const props = defineProps<{
  repo: any
}>()

defineEmits(['remove'])

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return 'Inconnu'
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}
</script>

<template>
  <div
    class="p-5 border border-default bg-elevated/40 hover:bg-elevated/85 rounded-xl transition-all shadow-sm flex flex-col justify-between gap-4 h-full relative group"
  >
    <div class="space-y-3">
      <!-- En-tête : Avatar et Nom -->
      <div class="flex items-center gap-3">
        <UAvatar
          :src="repo.avatarUrl || 'https://github.com/github.png'"
          :alt="repo.owner"
          size="md"
          class="border border-default bg-muted"
        />
        <div class="flex flex-col min-w-0">
          <NuxtLink
            :to="repo.htmlUrl"
            target="_blank"
            class="font-semibold text-highlighted hover:text-primary transition-colors text-sm truncate flex items-center gap-1.5"
          >
            {{ repo.fullName }}
            <UIcon name="i-lucide-external-link" class="text-[10px] text-muted group-hover:text-primary transition-colors" />
          </NuxtLink>
          <span class="text-[10px] text-muted">
            Ajouté le {{ formatDate(repo.createdAt) }}
          </span>
        </div>
      </div>

      <!-- Description -->
      <p class="text-xs text-muted line-clamp-2 h-8">
        {{ repo.description || 'Aucune description disponible' }}
      </p>
    </div>

    <!-- Statistiques et Actions -->
    <div class="flex items-center justify-between border-t border-default pt-3 mt-1">
      <!-- Indicateurs de stats -->
      <div class="flex items-center gap-4 text-xs font-medium text-muted">
        <div class="flex items-center gap-1" title="Stars">
          <UIcon name="i-lucide-star" class="text-amber-500 text-sm" />
          <span>{{ repo.stars }}</span>
        </div>
        <div class="flex items-center gap-1" title="Forks">
          <UIcon name="i-lucide-git-fork" class="text-blue-500 text-sm" />
          <span>{{ repo.forks }}</span>
        </div>
        <div class="flex items-center gap-1" title="Open Issues">
          <UIcon name="i-lucide-circle-dot" class="text-red-500 text-sm" />
          <span>{{ repo.openIssues }}</span>
        </div>
        <div v-if="repo.language" class="flex items-center gap-1.5" title="Langage">
          <span class="w-1.5 h-1.5 rounded-full bg-primary" />
          <span class="text-[11px]">{{ repo.language }}</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-1">
        <UButton
          icon="i-lucide-trash"
          color="error"
          variant="ghost"
          size="sm"
          @click="$emit('remove', repo.id, repo.fullName)"
        />
      </div>
    </div>
  </div>
</template>
