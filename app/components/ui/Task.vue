<script setup lang="ts">
defineProps<{
  task: Task
}>()
</script>

<template>
  <div class="p-4 border border-default rounded-lg shadow-sm hover:shadow-md transition-shadow">
    <div class="flex items-center justify-between">
      <div class="text-base text-pretty text-highlighted font-medium">{{ task.content }}</div>
      <UCheckbox v-model="task.isDone" size="xl" />
    </div>
  </div>
</template>
