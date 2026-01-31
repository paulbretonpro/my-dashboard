<script setup lang="ts">
const { data, pending } = useLazyFetch<PaginatedResponse<RssSource>>('/api/rss')

const route = useRoute()
const router = useRouter()

const filters = ref({
  period: '7d',
  read: 'all' as 'all' | 'read' | 'unread',
  new: false,
  sources: [0] as number[]
})

const sources = computed(() => data.value?.data || [])
const open = ref(false)
const periodOptions = [
  { label: 'Dernières 24 heures', value: '24h' },
  { label: 'Dernière semaine', value: '7d' },
  { label: 'Dernier mois', value: '30d' }
]

const isAllSources = computed(() => filters.value.sources.includes(0))

const toggleAllSources = (value: boolean | 'indeterminate') => {
  if (value === 'indeterminate') return
  filters.value.sources = value ? [0] : []
}

const toggleSource = (value: boolean | 'indeterminate', sourceId: number) => {
  if (value === 'indeterminate') return
  const current = new Set(filters.value.sources.filter((id) => id !== 0))
  if (value) {
    current.add(sourceId)
  } else {
    current.delete(sourceId)
  }
  filters.value.sources = current.size ? Array.from(current) : []
}

const syncFromRoute = () => {
  const period = typeof route.query.period === 'string' ? route.query.period : '7d'
  const read = typeof route.query.read === 'string' ? route.query.read : 'all'
  const isNew = route.query.new === 'true' || route.query.new === '1'
  const sourcesQuery = route.query.sources

  const sourcesValue: number[] = []
  if (Array.isArray(sourcesQuery)) {
    for (const value of sourcesQuery) {
      const parsed = Number(value)
      if (Number.isFinite(parsed) && parsed > 0) sourcesValue.push(parsed)
    }
  } else if (typeof sourcesQuery === 'string') {
    for (const value of sourcesQuery.split(',')) {
      const parsed = Number(value)
      if (Number.isFinite(parsed) && parsed > 0) sourcesValue.push(parsed)
    }
  }

  filters.value.period = period === '24h' || period === '7d' || period === '30d' ? period : '7d'
  filters.value.read = read === 'read' || read === 'unread' ? read : 'all'
  filters.value.new = isNew
  filters.value.sources = sourcesValue.length ? sourcesValue : [0]
}

const buildQuery = () => {
  const sourcesIds = filters.value.sources.filter((id) => id > 0)

  return {
    ...route.query,
    page: 1,
    period: filters.value.period,
    read: filters.value.read === 'all' ? undefined : filters.value.read,
    new: filters.value.new ? '1' : undefined,
    sources: sourcesIds.length ? sourcesIds.join(',') : undefined
  }
}

const applyFilters = () => {
  router.replace({ query: buildQuery() })
  open.value = false
}

onMounted(syncFromRoute)
watch(() => route.query, syncFromRoute, { deep: true })
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
          <UButton
            color="neutral"
            :variant="filters.read === 'all' ? 'subtle' : 'outline'"
            label="Tous"
            @click="filters.read = 'all'"
          />
          <UButton
            color="neutral"
            :variant="filters.read === 'unread' ? 'subtle' : 'outline'"
            label="Non lu(s)"
            @click="filters.read = 'unread'"
          />
          <UButton
            color="neutral"
            :variant="filters.read === 'read' ? 'subtle' : 'outline'"
            label="lu(s)"
            @click="filters.read = 'read'"
          />
        </UFieldGroup>

        <UCheckbox
          label="Nouveauté"
          description="Publié depuis la dernière connexion"
          size="xl"
          class="mb-6"
          v-model="filters.new"
        />

        <div class="text-neutral-500 font-medium text-sm mb-1">Source(s)</div>
        <div class="space-y-4 max-h-60 overflow-y-auto">
          <UCheckbox
            label="Toutes"
            size="xl"
            :model-value="isAllSources"
            class="mb-4"
            @update:model-value="toggleAllSources"
          />
          <UCheckbox
            v-for="source in sources"
            :key="source.id"
            :label="source.name"
            size="xl"
            :model-value="filters.sources.includes(source.id)"
            @update:model-value="(value) => toggleSource(value, source.id)"
          />
        </div>
      </div>
    </template>

    <template #footer="{ close }">
      <UButton block size="lg" label="Annuler" color="neutral" variant="outline" @click="close" />
      <UButton block size="lg" label="Appliquer" color="neutral" @click="applyFilters" />
    </template>
  </USlideover>
</template>
