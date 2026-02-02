<script setup lang="ts">
import type { ArticlesFilters } from '~~/server/api/articles/filters'

const { sources, loading } = useSources({
  server: false,
  withPagination: false
})

const props = defineProps<{
  modelValue: ArticlesFilters
}>()

const emit = defineEmits<{
  'apply-filters': [void]
  'update:filters': [value: ArticlesFilters]
}>()

const { isMobile } = useDevice()

const filters = computed({
  get: () => props.modelValue,
  set: (value: ArticlesFilters) => {
    emit('update:filters', value)
  }
})

const open = ref(false)
const periodOptions = [
  { label: 'Dernières 24 heures', value: '24h' },
  { label: 'Dernière semaine', value: '7d' },
  { label: 'Dernier mois', value: '30d' }
]

const isAllSources = computed(() => filters.value.sources?.length === 0)

const toggleAllSources = (value: boolean | 'indeterminate') => {
  if (value === 'indeterminate') return
  filters.value.sources = []
}

const toggleSource = (value: boolean | 'indeterminate', sourceId: number) => {
  if (value === 'indeterminate') return
  const current = new Set(filters.value.sources?.filter((id) => id !== 0))
  if (value) {
    current.add(sourceId)
  } else {
    current.delete(sourceId)
  }
  filters.value.sources = current.size ? Array.from(current) : []
}

const applyFilters = () => {
  emit('apply-filters')
  open.value = false
}
</script>

<template>
  <USlideover
    v-model:open="open"
    title="Filtrer les articles"
    description="Affinez la liste des articles en fonction de vos préférences."
  >
    <UButton
      icon="i-lucide-filter"
      :color="isMobile ? 'primary' : 'neutral'"
      :variant="isMobile ? 'solid' : 'subtle'"
      :loading
      :size="isMobile ? 'xl' : 'lg'"
      :class="{ 'rounded-full p-4': isMobile }"
    >
      {{ isMobile ? '' : 'Filtrer' }}
    </UButton>

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
          :model-value="filters.latest === 'true'"
          label="Nouveauté"
          description="Publié depuis la dernière connexion"
          size="xl"
          class="mb-6"
          @update:model-value="(value) => (filters.latest = value ? 'true' : undefined)"
        />

        <div class="text-neutral-500 font-medium text-sm mb-1">Source(s)</div>
        <div class="space-y-4 mb-6">
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
            :model-value="filters.sources?.includes(source.id)"
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
