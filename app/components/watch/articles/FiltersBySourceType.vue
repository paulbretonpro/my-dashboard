<script setup lang="ts">
import type { ArticlesFilters } from '~~/server/api/articles/filters'

const props = defineProps<{
  filters: ArticlesFilters
  data: CountArticleBySourceType[]
}>()

const emit = defineEmits<{
  'update:filters': [newFilters: ArticlesFilters]
}>()

const handleSelectSourceType = (sourceTypeId: number) => {
  const index = props.filters.sourcesTypes?.indexOf(sourceTypeId)

  if (index !== undefined) {
    if (index === -1) {
      emit('update:filters', {
        ...props.filters,
        sourcesTypes: [...(props.filters.sourcesTypes || []), sourceTypeId]
      })
    } else {
      emit('update:filters', {
        ...props.filters,
        sourcesTypes: props.filters.sourcesTypes?.filter((id) => id !== sourceTypeId)
      })
    }
  }
}
</script>

<template>
  <div class="flex gap-4">
    <UButton
      v-for="sourceType in data"
      :key="sourceType.id"
      :variant="filters.sourcesTypes?.includes(sourceType.id) ? 'solid' : 'outline'"
      color="neutral"
      size="sm"
      :label="`${sourceType.label} (${sourceType.count})`"
      @click="handleSelectSourceType(sourceType.id)"
    />
  </div>
</template>
