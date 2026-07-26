<script setup lang="ts" generic="T">
const props = defineProps<{
  title: string
  description?: string
  createPath?: string
  emptyMessage: string
  icon: string
  fetchFn: (options: { page: number; perPage: number }) => Promise<PaginatedResponse<T> | undefined>
  createFn?: () => Promise<void>
}>()

const loading = ref(true)
const items = ref<T[]>([])
const total = ref(0)
const pagination = ref({
  page: 1,
  perPage: 10
})

const handleFetchItems = async () => {
  loading.value = true
  try {
    const response = await props.fetchFn({
      page: pagination.value.page,
      perPage: pagination.value.perPage
    })

    if (response) {
      items.value = response.data
      total.value = response.total
    } else {
      items.value = []
      total.value = 0
    }
  } finally {
    loading.value = false
  }
}

const handleUpdatePagination = (newPage: number) => {
  pagination.value.page = newPage
  handleFetchItems()
}

onMounted(handleFetchItems)
</script>

<template>
  <div class="flex flex-col gap-6 w-full lg:max-w-5xl mx-auto">
    <UPageCard :title :description variant="naked" orientation="horizontal">
      <UButton label="Ajouter" icon="i-lucide-plus" :to="createPath" class="ml-auto" @click="createFn" />
    </UPageCard>

    <SharedPageList
      :items
      :loading
      :total
      :pagination
      :icon
      :empty-message
      @update:pagination="handleUpdatePagination"
    >
      <slot :items="items" />
    </SharedPageList>
  </div>
</template>
