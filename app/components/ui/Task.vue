<script setup lang="ts">
defineProps<{
  task: TaskWithPage
}>()
</script>

<template>
  <div
    class="p-4 border border-default rounded-lg hover:shadow-sm transition-shadow flex items-center gap-4"
  >
    <UCheckbox v-model="task.isDone" size="xl" />

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
