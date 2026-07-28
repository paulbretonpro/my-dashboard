<script lang="ts" setup>
const { setLayout, setLayoutLoading } = useLayoutStore()
const route = useRoute()

const taskId = computed(() => Number(route.params.id))

const {
  data: task,
  error,
  status,
  pending,
  refresh
} = useLazyAsyncData<any>(
  computed(() => `task-edit-${taskId.value}`),
  () => $fetch(`/api/tasks/${taskId.value}`),
  { server: false }
)

const onSave = () => {
  navigateTo(`/tasks/${taskId.value}`)
}

const onCancel = () => {
  navigateTo(`/tasks/${taskId.value}`)
}

watch([pending, status], () => {
  setLayoutLoading(pending.value || isLoading(status.value))
})

watch(
  task,
  () => {
    setLayout({
      title: task.value ? `Modifier : ${task.value.title}` : 'Modifier le sujet'
    })
  },
  { immediate: true }
)
</script>

<template>
  <div class="w-full max-w-4xl mx-auto space-y-6 px-4 py-6">
    <div class="flex items-center gap-2">
      <NuxtLink
        :to="`/tasks/${taskId}`"
        class="flex items-center gap-1 text-sm text-muted hover:text-primary transition-colors"
      >
        <UIcon name="i-lucide-arrow-left" />
        Retour
      </NuxtLink>
    </div>

    <UAlert
      v-if="error"
      icon="i-lucide-circle-alert"
      color="error"
      variant="soft"
      title="Une erreur est survenue"
      close
      :description="(error as any)?.data?.statusMessage || 'Erreur'"
    />

    <div
      v-if="task"
      class="p-0 sm:p-8 border-0 sm:border border-default bg-transparent sm:bg-elevated/40 rounded-none sm:rounded-md shadow-none sm:shadow-sm space-y-6"
    >
      <div class="border-b border-default pb-4">
        <h1 class="text-2xl font-bold text-highlighted">Modifier le sujet</h1>
        <p class="text-sm text-muted">
          Ajustez le titre, le statut, la date limite ou la description de votre sujet.
        </p>
      </div>

      <TasksForm :task="task" @save="onSave" @cancel="onCancel" />
    </div>

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
