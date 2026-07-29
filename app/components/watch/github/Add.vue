<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { refDebounced } from '@vueuse/core'

const url = defineModel<string>('url', { default: '' })

defineProps<{
  loading?: boolean
}>()

const emit = defineEmits(['add'])

const searchTerm = ref('')
const searchTermDebounced = refDebounced(searchTerm, 300)

// Fetch popular and matching repos from our search endpoint
const { data: suggestions, pending } = useFetch('/api/github/search', {
  params: { q: searchTermDebounced },
  watch: [searchTermDebounced]
})

// Sync input value with typed search term
watch(searchTerm, (newVal) => {
  url.value = newVal
})

// Handle option selection - immediately follow the repo
const onSelect = async (val: any) => {
  if (typeof val === 'string') {
    url.value = val
    searchTerm.value = val
  } else if (val && typeof val === 'object') {
    const value = val.value || val.label
    url.value = value
    searchTerm.value = value
  }

  if (url.value.trim()) {
    emit('add')
  }
}
</script>

<template>
  <div class="flex items-center gap-2 w-full max-w-sm">
    <UInputMenu
      v-model="url"
      v-model:search-term="searchTerm"
      :items="suggestions || []"
      :loading="pending"
      value-key="value"
      ignore-filter
      placeholder="ex: nuxt/nuxt ou URL"
      icon="i-simple-icons-github"
      size="md"
      class="flex-1"
      @update:model-value="onSelect"
      @keydown.enter="emit('add')"
    />
    <UButton
      label="Suivre"
      icon="i-lucide-plus"
      size="md"
      :loading="loading"
      @click="emit('add')"
    />
  </div>
</template>
