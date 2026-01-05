<script lang="ts" setup>
import type { TaskWithPage } from '~~/shared/types'

const props = defineProps<{
  task: TaskWithPage
}>()

const emit = defineEmits<{
  'update:task': [value: TaskWithPage]
}>()

const currentTask = ref<TaskWithPage>({ ...props.task })
const additionnalNotesHasChange = ref<boolean>(false)

const { error, loading, updateIsDone, updateAdditionnalNotes, resetError } = useUpdateTask(
  props.task
)

const statusBadge = computed(() => {
  return currentTask.value.isDone
    ? { label: 'Terminée', color: 'success' as const }
    : { label: 'À faire', color: 'info' as const }
})

const meta = computed(() => [
  {
    label: 'Statut',
    value: statusBadge.value.label,
    color: statusBadge.value.color,
    icon: currentTask.value.isDone ? 'i-lucide-badge-check' : 'i-lucide-hourglass'
  },
  {
    label: 'Échéance',
    value: currentTask.value.deadline
      ? new Date(currentTask.value.deadline).toLocaleString()
      : 'Non définie',
    icon: 'i-lucide-calendar-clock'
  },
  {
    label: 'Créée le',
    value: currentTask.value.createdAt
      ? new Date(currentTask.value.createdAt).toLocaleString()
      : '—',
    icon: 'i-lucide-clock-4'
  }
])

const handleUpdateIsDone = async (value: boolean | 'indeterminate') => {
  if (value === 'indeterminate') return

  try {
    currentTask.value.isDone = value
    const response = await updateIsDone(value)
    if (response) {
      emit('update:task', response)
    }
  } catch {
    currentTask.value.isDone = props.task.isDone
  }
}

const handleUpdateAdditionalNotes = async (value: string) => {
  currentTask.value.additionalNotes = value

  try {
    const response = await updateAdditionnalNotes(value)

    if (response) {
      emit('update:task', response)
    }
  } catch {
    currentTask.value.additionalNotes = props.task.additionalNotes
  } finally {
    additionnalNotesHasChange.value = false
  }
}

const handleClearAdditionalNotes = async () => {
  currentTask.value.additionalNotes = ''

  try {
    const response = await updateAdditionnalNotes()

    if (response) {
      emit('update:task', response)
    }
  } catch {
    currentTask.value.additionalNotes = props.task.additionalNotes
  } finally {
    additionnalNotesHasChange.value = false
  }
}

watchEffect(() => {
  if (currentTask.value.additionalNotes !== props.task.additionalNotes) {
    additionnalNotesHasChange.value = true
  }
})

defineExpose({
  error,
  loading,
  resetError
})
</script>

<template>
  <div class="space-y-6">
    <UPageCard
      :title="task?.content || 'Chargement...'"
      orientation="horizontal"
      :ui="{ container: 'lg:grid-cols-[auto_auto]' }"
    >
      <UCheckbox
        size="xl"
        :model-value="currentTask.isDone"
        :disabled="loading"
        class="mx-auto"
        @update:model-value="handleUpdateIsDone"
      />

      <template #footer>
        <div class="flex gap-8">
          <div v-for="item in meta" :key="item.label" class="space-y-2">
            <div class="flex items-center gap-2 text-muted text-xs font-medium">
              <UIcon :name="item.icon" />
              <span>{{ item.label }}</span>
            </div>

            <div class="text-sm text-highlighted font-medium">
              <template v-if="item.color">
                <UBadge :label="item.value" :color="item.color" variant="outline" />
              </template>
              <template v-else>
                {{ item.value }}
              </template>
            </div>
          </div>
        </div>
      </template>
    </UPageCard>

    <UCard>
      <template #header>
        <div class="flex items-center gap-2 text-sm text-muted">
          <UIcon name="i-lucide-align-left" class="size-4" />
          <span>Note additionnelle</span>
        </div>
      </template>
      <div class="flex gap-2 items-center" v-auto-animate>
        <UTextarea
          v-model="currentTask.additionalNotes"
          variant="ghost"
          placeholder="Ajouter des détails..."
          :disabled="loading"
          class="w-full text-highlighted text-sm font-medium"
        />

        <template v-if="additionnalNotesHasChange">
          <UButton
            icon="i-lucide-check"
            size="sm"
            variant="ghost"
            class="h-fit"
            @click="handleUpdateAdditionalNotes(currentTask.additionalNotes ?? '')"
          />
          <UButton
            icon="i-lucide-trash"
            size="sm"
            variant="ghost"
            color="error"
            class="h-fit"
            @click="handleClearAdditionalNotes"
          />
        </template>
      </div>
    </UCard>
  </div>
</template>
