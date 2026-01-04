<script setup lang="ts">
defineProps<{
  tasks: Task[]
  loading: boolean
}>()

const emit = defineEmits(['update'])
</script>

<template>
  <div v-if="loading" class="text-center text-muted">Chargement...</div>

  <div v-else-if="tasks.length === 0" class="text-center text-muted">Aucune tâche</div>

  <div v-else class="space-y-2" v-auto-animate>
    <UiTask v-for="task in tasks" :key="task.id" :task @update="emit('update')" />
  </div>
</template>
