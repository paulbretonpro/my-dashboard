<script setup lang="ts">
import { SharedPageActionsEditOrDelete } from '#components'

const { setLayout } = useLayoutStore()

const { getNote, note, loading, error } = useNote()

setLayout({
  actions: () =>
    h(SharedPageActionsEditOrDelete, {
      onDelete: () => {
        const toast = useToast()
        toast.add({
          title: 'Suppression de la note',
          description: "Cette fonctionnalité n'est pas encore disponible.",
          color: 'info'
        })
      },
      onEdit: () => {
        navigateTo(`/notes/${note.value?.id}/edit`)
      },
      onBack: () => navigateTo('/notes')
    })
})

onMounted(getNote)

onUnmounted(() => {
  setLayout({
    actions: undefined
  })
})
</script>

<template>
  <div class="w-full lg:max-w-7xl mx-auto space-y-6">
    <UEmpty
      v-if="loading"
      icon="i-lucide-notebook"
      title="Chargement..."
      description="Si le chargement est trop long, tu as le temps pour un café "
    />
    <template v-else>
      <UEmpty
        v-if="error"
        icon="i-lucide-alert-triangle"
        title="Erreur"
        description="Une erreur est survenue lors du chargement du résumé."
        class="mx-auto"
      />

      <UEditor
        ref="editorRef"
        :model-value="note?.content"
        content-type="markdown"
        :editable="false"
      />
    </template>
  </div>
</template>
