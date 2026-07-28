<script lang="ts" setup>
const { setLayout, setLayoutLoading } = useLayoutStore()
const route = useRoute()
const toast = useToast()

const taskId = computed(() => Number(route.params.id))
const errorOnDelete = ref()
const errorLoading = ref<boolean>(false)

const {
  data: task,
  error,
  status,
  pending
} = useLazyAsyncData<any>(
  computed(() => `task-${taskId.value}`),
  () => $fetch(`/api/tasks/${taskId.value}`),
  { server: false }
)

const onDelete = async () => {
  errorOnDelete.value = undefined
  errorLoading.value = true

  try {
    await $fetch(`/api/tasks/${taskId.value}`, { method: 'DELETE' })
    toast.add({
      title: 'Succès',
      description: 'Sujet supprimé avec succès.',
      color: 'success'
    })
    navigateTo('/tasks')
  } catch (err) {
    errorOnDelete.value = err
    toast.add({
      title: 'Erreur',
      description: 'Impossible de supprimer le sujet.',
      color: 'error'
    })
  } finally {
    errorLoading.value = false
  }
}

watch([pending, status], () => {
  setLayoutLoading(pending.value || isLoading(status.value))
})

watch(
  task,
  () => {
    setLayout({
      title: task.value ? task.value.title : 'Détails du sujet',
      actions: () =>
        h('div', { class: 'flex gap-2' }, [
          h(resolveComponent('UButton'), {
            label: 'Modifier',
            icon: 'i-lucide-square-pen',
            color: 'primary',
            variant: 'solid',
            to: `/tasks/${taskId.value}/edit`
          }),
          h(resolveComponent('UButton'), {
            label: 'Supprimer',
            icon: 'i-lucide-trash-2',
            color: 'danger',
            variant: 'subtle',
            onClick: onDelete
          })
        ])
    })
  },
  { immediate: true }
)

const getStatusBadgeProps = (status?: string) => {
  switch (status) {
    case 'done':
      return { color: 'success' as const, label: 'Terminé', icon: 'i-lucide-circle-check' }
    case 'pending':
      return { color: 'warning' as const, label: 'En attente', icon: 'i-lucide-clock' }
    case 'todo':
    default:
      return { color: 'info' as const, label: 'À faire', icon: 'i-lucide-circle' }
  }
}
</script>

<template>
  <div class="w-full max-w-4xl mx-auto space-y-6 px-4 py-6">
    <UAlert
      v-if="error || errorOnDelete"
      icon="i-lucide-circle-alert"
      color="error"
      variant="soft"
      title="Une erreur est survenue"
      close
      :description="(error as any)?.data?.statusMessage || errorOnDelete?.message || 'Erreur'"
    />

    <template v-if="task">
      <div class="flex items-center gap-2">
        <NuxtLink
          to="/tasks"
          class="flex items-center gap-1 text-sm text-muted hover:text-primary transition-colors"
        >
          <UIcon name="i-lucide-arrow-left" />
          Retour
        </NuxtLink>
      </div>

      <div class="p-0 sm:p-8 border-0 sm:border border-default bg-transparent sm:bg-elevated/40 rounded-none sm:rounded-md shadow-none sm:shadow-sm space-y-6">
        <div class="flex flex-col gap-4">
          <h1 class="text-3xl font-extrabold text-highlighted leading-tight">
            {{ task.title }}
          </h1>

          <div class="flex flex-wrap items-center gap-4 text-sm text-muted">
            <UBadge
              :color="getStatusBadgeProps(task.status).color"
              variant="soft"
              size="md"
              class="flex items-center gap-1.5"
            >
              <UIcon :name="getStatusBadgeProps(task.status).icon" />
              {{ getStatusBadgeProps(task.status).label }}
            </UBadge>

            <UBadge
              v-if="task.deadline"
              color="neutral"
              variant="soft"
              size="md"
              class="flex items-center gap-1.5"
            >
              <UIcon name="i-lucide-calendar" />
              Date limite : {{ new Date(task.deadline).toLocaleDateString('fr-FR') }}
            </UBadge>

            <div class="text-sm ml-auto space-y-2">
              <UIcon name="i-lucide-clock" class="size-3" />
              Créé le {{ new Date(task.createdAt).toLocaleDateString('fr-FR') }}
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-3">
        <div v-if="task.content && task.content.trim() !== ''">
          <UEditor :model-value="task.content" content-type="html" :editable="false" />
        </div>

        <div
          v-else
          class="text-sm text-muted italic py-6 text-center border border-dashed border-default rounded-xl bg-default/10"
        >
          Aucun descriptif ou contenu rédigé pour ce sujet.
        </div>
      </div>
    </template>

    <UEmpty
      v-else
      icon="i-lucide-loader-circle"
      title="Chargement..."
      description="Nous récupérons les détails du sujet."
    >
      <template #icon>
        <UIcon name="i-lucide-loader-circle" class="animate-spin text-4xl text-primary" />
      </template>
    </UEmpty>
  </div>
</template>
