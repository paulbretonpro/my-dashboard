<script setup lang="ts">
interface RssSourceWithSubscription extends RssSource {
  isSubscribed: boolean
  isLoading?: boolean
}

const emit = defineEmits(['close'])
const loading = ref(true)
const options = ref<RssSourceWithSubscription[]>([])

const handleFetchSources = async () => {
  loading.value = true
  const response = await $fetch<{ data: RssSourceWithSubscription[] }>('/api/explore/sources')
  options.value = response.data
  loading.value = false
}

const handleSubcribeUserToSource = async (source: RssSourceWithSubscription) => {
  if (!source) return

  source.isLoading = true
  try {
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
  } finally {
    source.isLoading = false
  }
}
</script>

<template>
  <UModal
    description="Vous pouvez explorer les sources disponibles"
    title="Explorer les sources"
    @update:open="(value) => value === false && emit('close')"
  >
    <UButton icon="i-lucide-plus" class="w-fit ml-auto" @click="handleFetchSources">
      Ajouter
    </UButton>

    <template #body>
      <div class="flex flex-col gap-4 max-h-96 overflow-y-auto">
        <div v-if="loading">chargement...</div>

        <div v-for="source in options" :key="source.id" class="flex justify-between items-center">
          <div>{{ source.name }}</div>
          <UButton
            :icon="source.isSubscribed ? 'i-lucide-trash' : 'i-lucide-bell-plus'"
            size="sm"
            variant="subtle"
            :loading="source.isLoading"
            :color="source.isSubscribed ? 'error' : 'primary'"
            @click="handleSubcribeUserToSource(source)"
          >
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>
