<script lang="ts" setup>
import type { Task } from '~~/shared/types'

definePageMeta({
  middleware: 'auth'
})

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
  () => errorLoading.value || (taskDetailRef.value?.loading ?? false)
)
const taskDetailError = computed(() => taskDetailRef.value?.error || errorOnDelete.value)
const errorOnTaskId = computed(() => error.value || taskDetailError.value)

const { data: task, error } = useLazyAsyncData<Task>(
  computed(() => `task-${taskId.value}`),
  () => $fetch(`/api/tasks/${taskId.value}`),
  { server: false }
)

const onDelete = async () => {
  errorOnDelete.value = undefined
  errorLoading.value = true

  try {
    await $fetch(`/api/tasks/${taskId.value}`, { method: 'DELETE' })
    navigateTo('/')
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
</script>

<template>
  <UDashboardPanel id="task-detail">
    <template #header>
      <UDashboardNavbar
        :title="`${task?.content || 'Tâche'}`"
        description="Détails et actions rapides"
      >
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right v-if="!error">
          <div class="flex items-center gap-2">
            <UButton v-if="taskDetailIsLoading" loading variant="ghost">Chargement...</UButton>

            <UButton icon="i-lucide-trash-2" color="error" variant="subtle" @click="onDelete">
              Supprimer
            </UButton>
          </div>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="w-full max-w-3xl mx-auto space-y-6">
        <UAlert
          v-if="errorOnTaskId"
          icon="i-lucide-circle-alert"
          color="error"
          variant="soft"
          title="Impossible de charger la tâche"
          close
          @update:open="handleResetError"
          :description="
            errorOnTaskId?.data?.statusMessage || errorOnTaskId?.message || errorOnTaskId
          "
        />

        <TasksDetails v-if="task" ref="taskDetailRef" :task />
      </div>
    </template>
  </UDashboardPanel>
</template>
