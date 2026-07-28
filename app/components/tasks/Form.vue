<script setup lang="ts">
const props = defineProps<{
  task?: any
  hideFooterButtons?: boolean
}>()

const emit = defineEmits(['save', 'cancel'])

const toast = useToast()
const form = ref({
  title: props.task?.title || '',
  content: props.task?.content || '',
  status: props.task?.status || 'todo',
  deadline: props.task?.deadline ? new Date(props.task.deadline).toISOString().substring(0, 10) : ''
})

defineExpose({
  onSave: () => onSave()
})

const isEditMode = computed(() => !!props.task)

const statusOptions = [
  { label: 'À faire', value: 'todo' },
  { label: 'En attente', value: 'pending' },
  { label: 'Terminé', value: 'done' }
]

const titleInputRef = ref<any>(null)

onMounted(() => {
  setTimeout(() => {
    if (titleInputRef.value) {
      if (typeof titleInputRef.value.focus === 'function') {
        titleInputRef.value.focus()
      } else if (titleInputRef.value.$el) {
        const input = titleInputRef.value.$el.querySelector('input')
        input?.focus()
      }
    }
  }, 350)
})

const onSave = async () => {
  if (!form.value.title.trim()) {
    toast.add({
      title: 'Erreur',
      description: 'Le titre est obligatoire.',
      color: 'error'
    })
    return
  }

  try {
    const path = isEditMode.value ? `/api/tasks/${props.task?.id}` : '/api/tasks'
    const body = {
      title: form.value.title.trim(),
      content: form.value.content,
      status: form.value.status,
      deadline: form.value.deadline ? new Date(form.value.deadline).toISOString() : null
    }

    await $fetch(path, {
      method: isEditMode.value ? 'PUT' : 'POST',
      body
    })

    toast.add({
      title: 'Succès',
      description: isEditMode.value ? 'Sujet mis à jour avec succès.' : 'Sujet créé avec succès.',
      color: 'success'
    })

    emit('save')
  } catch (err: any) {
    toast.add({
      title: 'Erreur',
      description: err?.data?.statusMessage || "Impossible d'enregistrer le sujet.",
      color: 'error'
    })
  }
}
</script>

<template>
  <div
    class="flex flex-col justify-between gap-4 h-full"
    :class="{ 'pb-20 sm:pb-0': !hideFooterButtons }"
    @keydown.ctrl.enter="onSave"
    @keydown.meta.enter="onSave"
  >
    <div class="space-y-4">
      <UFormField label="Titre du sujet" name="title" required>
        <UInput
          ref="titleInputRef"
          v-model="form.title"
          placeholder="Ex: Refondre la page de profil"
          size="lg"
          class="w-full"
        />
      </UFormField>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormField label="Statut" name="status">
          <USelectMenu
            v-model="form.status"
            :items="statusOptions"
            label-key="label"
            value-key="value"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Date limite" name="deadline">
          <UInput v-model="form.deadline" type="date" class="w-full" />
        </UFormField>
      </div>

      <UFormField label="Description / Contenu" name="content" class="min-h-64 sm:min-h-96">
        <SharedEditor v-model="form.content" />
      </UFormField>
    </div>

    <div v-if="!hideFooterButtons" class="fixed bottom-0 left-0 right-0 z-40 p-4 bg-elevated/95 backdrop-blur-md border-t border-default flex justify-end gap-2 sm:relative sm:p-0 sm:bg-transparent sm:border-0 sm:mt-auto sm:pt-2">
      <UButton label="Annuler" color="neutral" variant="ghost" @click="emit('cancel')" />
      <UButton label="Enregistrer" color="primary" @click="onSave" />
    </div>
  </div>
</template>
