<script setup lang="ts">
import type { Note } from '~~/shared/types'

const toast = useToast()

const handleFetchNotes = async (options: {
  page: number
  perPage: number
}): Promise<PaginatedResponse<Note> | undefined> => {
  try {
    const response = await $fetch<PaginatedResponse<Note>>('/api/notes', {
      query: {
        page: options.page,
        perPage: options.perPage
      }
    })
    return response
  } catch {
    toast.add({
      title: 'Erreur',
      description: 'Impossible de charger les notes, réessaie plus tard.',
      color: 'error'
    })
  }
}
</script>

<template>
  <SharedPage
    title="Liste des notes"
    description="Toutes les idées qui me passent par la tête."
    create-path="/notes/create"
    empty-message="Aucune note trouvée"
    icon="i-lucide-notebook"
    :fetch-fn="handleFetchNotes"
  >
    <template #default="{ items }">
      <UPageColumns>
        <UCard
          v-for="item in items"
          :key="item.id"
          variant="soft"
          @click.prevent="navigateTo(`/notes/${item.id}`)"
          class="hover:cursor-pointer"
        >
          <div class="flex items-center justify-between gap-4 mb-4">
            <div class="font-medium">{{ item.title }}</div>
            <UButton color="neutral" variant="subtle" icon="i-lucide-ellipsis-vertical" />
          </div>
          <div class="text-sm text-muted">
            {{ new Date(item.createdAt).toLocaleDateString() }}
          </div>
        </UCard>
      </UPageColumns>
    </template>
  </SharedPage>
</template>
