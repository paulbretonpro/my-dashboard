<script lang="ts" setup>
import type { Task } from '~~/shared/types'

const { setLayout, setLayoutLoading } = useLayoutStore()

const taskDetailRef = useTemplateRef<{
  loading?: boolean
  error?: unknown
  resetError?: () => void
}>('taskDetailRef')

const route = useRoute()

const errorOnDelete = ref()
const errorLoading = ref<boolean>(false)

const taskId = computed(() => Number(route.params.id))
const taskDetailIsLoading = computed<boolean>(
  () =>
    errorLoading.value ||
    pending.value ||
    isLoading(status.value) ||
    (taskDetailRef.value?.loading ?? false)
)
const taskDetailError = computed(() => taskDetailRef.value?.error || errorOnDelete.value)
const errorOnTaskId = computed(() => error.value || taskDetailError.value)

const {
  data: task,
  error,
  status,
  pending
} = useLazyAsyncData<Task>(
  computed(() => `task-${taskId.value}`),
  () => $fetch(`/api/tasks/${taskId.value}`),
  { server: false }
)

const onDelete = async () => {
  errorOnDelete.value = undefined
  errorLoading.value = true

  try {
    await $fetch(`/api/tasks/${taskId.value}`, { method: 'DELETE' })
    navigateTo('/dashboard')
  } catch (err) {
    errorOnDelete.value = err
  } finally {
    errorLoading.value = false
  }
}

const handleResetError = () => {
  errorOnDelete.value = undefined
  taskDetailRef.value?.resetError && taskDetailRef.value.resetError()
}

watch(taskDetailIsLoading, (newVal) => {
  setLayoutLoading(newVal)
})

watch(task, () => {
  setLayout({
    title: task.value ? task.value.content : 'Détails de la tâche',
    actions: () =>
      h(resolveComponent('UButton'), {
        label: 'Supprimer',
        icon: 'i-lucide-trash-2',
        color: 'error',
        variant: 'subtle',
        onClick: onDelete
      })
  })
})
</script>

<template>
  <div class="w-full max-w-3xl mx-auto space-y-6">
    <UAlert
      v-if="errorOnTaskId"
      icon="i-lucide-circle-alert"
      color="error"
      variant="soft"
      title="Impossible de charger la tâche"
      close
      @update:open="handleResetError"
      :description="errorOnTaskId?.data?.statusMessage || errorOnTaskId?.message || errorOnTaskId"
    />

    <TasksDetails v-if="task" ref="taskDetailRef" v-model:task="task" />

    <UEmpty
      v-else
      icon="i-lucide-square-check"
      title="Chargement..."
      description="Si le chargement est trop long, tu as le temps pour un café "
    >
    </UEmpty>
  </div>
</template>
