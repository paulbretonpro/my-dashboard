<script setup lang="ts">
const { setLayout } = useLayoutStore()

setLayout({
  title: 'Dépôts GitHub'
})

// Utiliser notre nouveau composable de veille GitHub !
const {
  repos,
  loading,
  newRepoUrl,
  isSubmitting,
  handleAddRepo,
  handleRemoveRepo,
  followRepo
} = useGithubRepos()
</script>

<template>
  <div class="flex flex-col gap-8 w-full lg:max-w-4xl mx-auto">
    <UPageCard
      title="Dépôts GitHub"
      description="Suivez vos dépôts GitHub favoris et visualisez leurs statistiques clés en un coup d'œil."
      variant="naked"
      orientation="horizontal"
      :ui="{ title: 'text-2xl text-pretty font-bold text-highlighted' }"
    >
      <template #default>
        <div class="sm:ml-auto mt-4 sm:mt-0 w-full max-w-sm">
          <WatchGithubAdd
            v-model:url="newRepoUrl"
            :loading="isSubmitting"
            @add="handleAddRepo"
          />
        </div>
      </template>
    </UPageCard>

    <WatchGithubList
      :repos="repos"
      :loading="loading"
      @remove="handleRemoveRepo"
    />

    <UDivider class="my-2" />

    <!-- Découvrir / Explorer des dépôts populaires -->
    <WatchGithubExplore
      :tracked-repos="repos"
      :follow-repo="followRepo"
    />
  </div>
</template>
