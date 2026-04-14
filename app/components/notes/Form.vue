<script setup lang="ts">
import { SharedPageActionsSaveOrCancel } from '#components'

const props = defineProps<{
  note?: Note
  title: string
  description: string
}>()

const { setLayout, setLayoutLoading } = useLayoutStore()

const toast = useToast()
const form = ref<Partial<NewNote>>({
  content: props.note?.content || '',
  title: props.note?.title || ''
})

const isEditMode = computed(() => !!props.note)

const onSave = async () => {
  setLayoutLoading(true)

  try {
    const path = isEditMode.value ? `/api/notes/${props.note?.id}` : '/api/notes'

    const insertedNote = await $fetch<Note>(path, {
      method: isEditMode.value ? 'PUT' : 'POST',
      body: { ...form.value }
    })

    toast.add({
      title: 'Succès',
      description: isEditMode.value ? 'Note mise à jour avec succès.' : 'Note créée avec succès.',
      color: 'success'
    })

    navigateTo(`/notes/${insertedNote.id || props.note?.id}`)
  } catch {
    toast.add({
      title: 'Erreur',
      description: isEditMode.value
        ? 'Impossible de mettre à jour la note.'
        : 'Impossible de créer la note.',
      color: 'error'
    })
  } finally {
    setLayoutLoading(false)
  }
}

setLayout({
  title: isEditMode.value ? props.note?.title : 'Nouvelle note',
  actions: () =>
    h(SharedPageActionsSaveOrCancel, {
      onSave,
      onBack: () => navigateTo('/notes')
    })
})
</script>

<template>
  <div class="flex flex-col gap-4 w-full lg:max-w-2xl mx-auto">
    <UPageCard :title :description variant="naked" orientation="horizontal" />

    <UFormField label="Titre de la note" name="title">
      <UInput v-model="form.title" placeholder="Titre" size="lg" class="w-full" />
    </UFormField>

    <UFormField label="Contenu de la note" name="content">
      <SharedEditor v-model="form.content" />
    </UFormField>
  </div>
</template>
