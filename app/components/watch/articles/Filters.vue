<script setup lang="ts">
const { data, pending } = useLazyFetch<PaginatedResponse<RssSource>>('/api/rss')

const filters = ref({
  period: '7d',
  sources: [0] as number[]
})

const sources = computed(() => data.value?.data || [])
const open = ref(false)
const periodOptions = [
  { label: 'Dernières 24 heures', value: '24h' },
  { label: 'Dernière semaine', value: '7d' },
  { label: 'Dernier mois', value: '30d' }
]
</script>

<template>
  <USlideover
    v-model:open="open"
    title="Filtrer les articles"
    description="Affinez la liste des articles en fonction de vos préférences."
  >
    <UButton
      label="Filtres"
      icon="i-lucide-filter"
      color="neutral"
      variant="subtle"
      :loading="pending"
    />

    <template #body>
      <div class="h-full w-full">
        <div class="text-neutral-500 font-medium text-sm mb-1">Date de publication</div>
        <USelectMenu
          v-model="filters.period"
          :items="periodOptions"
          label-key="label"
          value-key="value"
          class="mb-6 w-full"
        />

        <UFieldGroup class="mb-6">
          <UButton color="neutral" variant="subtle" label="Tous" />
          <UButton color="neutral" variant="outline" label="Non lu(s)" />
          <UButton color="neutral" variant="outline" label="lu(s)" />
        </UFieldGroup>

        <UCheckbox
          label="Nouveauté"
          description="Publié depuis la dernière connexion"
          size="xl"
          class="mb-6"
        />

        <div class="text-neutral-500 font-medium text-sm mb-1">Source(s)</div>
        <div class="space-y-4 max-h-60 overflow-y-auto">
          <UCheckbox
            label="Toutes"
            size="xl"
            :model-value="filters.sources.includes(0)"
            class="mb-4"
          />
          <UCheckbox
            v-for="source in sources"
            :key="source.id"
            :label="source.name"
            size="xl"
            :value="source.id"
          />
        </div>
      </div>
    </template>

    <template #footer="{ close }">
      <UButton block size="lg" label="Annuler" color="neutral" variant="outline" @click="close" />
      <UButton block size="lg" label="Appliquer" color="neutral" />
    </template>
  </USlideover>
</template>
