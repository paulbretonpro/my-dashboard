<script setup lang="ts">
const props = defineProps<{
  task: TaskWithPage
}>()

const emit = defineEmits(['update'])

const { updateIsDone } = useUpdateTask(props.task)

const handleTaskIsDoneChange = async (isDone: boolean | 'intermediate') => {
  if (isDone === 'intermediate') return

  await updateIsDone(isDone)
  emit('update', { ...props.task, isDone })
}
</script>

<template>
  <div
    class="p-4 border border-default rounded-lg hover:shadow-sm transition-shadow flex items-center gap-4"
    :class="{ 'opacity-50': task.isDone }"
  >
    <UCheckbox
      :model-value="props.task.isDone"
      size="xl"
      @update:model-value="handleTaskIsDoneChange"
    />

    <div class="flex flex-col gap-2 w-full justify-center">
      <div class="text-base text-pretty text-highlighted font-medium">{{ task.content }}</div>

      <div class="flex gap-2">
        <UBadge v-if="task.page" :label="task.page.name" size="sm" variant="soft" color="primary" />

        <UBadge
          v-if="task.deadline"
          :label="new Date(task.deadline).toLocaleDateString()"
          size="sm"
          variant="soft"
          color="info"
        />
      </div>
    </div>

    <UButton
      label="voir plus"
      trailing-icon="i-lucide-chevron-right"
      variant="ghost"
      color="neutral"
      :to="`/tasks/${task.id}`"
      size="xs"
    />
  </div>
</template>
