<script setup lang="ts">
const { tasks, loading, refresh, groupedTasks, changeTaskStatus } = useRoadmap()

provide('changeTaskStatus', changeTaskStatus)

defineExpose({
  refresh
})
</script>

<template>
  <div>
    <div v-if="loading && (!tasks || tasks.length === 0)" class="text-center py-12 text-muted">
      <UIcon name="i-lucide-loader-circle" class="animate-spin text-2xl" />
      <p class="mt-2 text-sm">Chargement de la roadmap...</p>
    </div>

    <div
      v-else-if="!tasks || tasks.length === 0"
      class="text-center py-12 border border-dashed border-default rounded-xl bg-elevated/20"
    >
      <UIcon name="i-lucide-route" class="text-4xl text-muted" />
      <h3 class="mt-4 font-semibold text-highlighted">Aucun sujet</h3>
      <p class="mt-1 text-sm text-muted">
        Créez votre premier sujet pour commencer à construire votre roadmap.
      </p>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start" v-auto-animate>
      <!-- Column: À faire -->
      <div class="flex flex-col gap-4">
        <div class="flex items-center justify-between px-2 pb-1">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-circle" class="text-info text-lg" />
            <span class="font-bold text-highlighted text-base">À faire</span>
            <UBadge
              :label="String(groupedTasks.todo.length)"
              color="info"
              variant="soft"
              size="sm"
              class="rounded-full"
            />
          </div>
        </div>

        <div
          class="space-y-4 p-4 rounded-2xl bg-elevated/10 border border-default md:min-h-125"
          v-auto-animate
        >
          <div
            v-if="groupedTasks.todo.length === 0"
            class="text-xs text-muted text-center py-12 italic border border-dashed border-default rounded-xl bg-default/40"
          >
            Aucun sujet à faire
          </div>

          <TasksCard v-for="task in groupedTasks.todo" :key="task.id" :task="task" />
        </div>
      </div>

      <!-- Column: En attente -->
      <div class="flex flex-col gap-4">
        <div class="flex items-center justify-between px-2 pb-1">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-clock" class="text-warning text-lg" />
            <span class="font-bold text-highlighted text-base">En attente</span>
            <UBadge
              :label="String(groupedTasks.pending.length)"
              color="warning"
              variant="soft"
              size="sm"
              class="rounded-full"
            />
          </div>
        </div>

        <div
          class="space-y-4 p-4 rounded-2xl bg-elevated/10 border border-default md:min-h-125"
          v-auto-animate
        >
          <div
            v-if="groupedTasks.pending.length === 0"
            class="text-xs text-muted text-center py-12 italic border border-dashed border-default rounded-xl bg-default/40"
          >
            Aucun sujet en attente
          </div>

          <TasksCard v-for="task in groupedTasks.pending" :key="task.id" :task="task" />
        </div>
      </div>

      <!-- Column: Terminé -->
      <div class="flex flex-col gap-4">
        <div class="flex items-center justify-between px-2 pb-1">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-circle-check" class="text-success text-lg" />
            <span class="font-bold text-highlighted text-base">Terminé</span>
            <UBadge
              :label="String(groupedTasks.done.length)"
              color="success"
              variant="soft"
              size="sm"
              class="rounded-full"
            />
          </div>
        </div>

        <div
          class="space-y-4 p-4 rounded-2xl bg-elevated/10 border border-default md:min-h-125"
          v-auto-animate
        >
          <div
            v-if="groupedTasks.done.length === 0"
            class="text-xs text-muted text-center py-12 italic border border-dashed border-default rounded-xl bg-default/40"
          >
            Aucun sujet terminé
          </div>

          <TasksCard v-for="task in groupedTasks.done" :key="task.id" :task="task" dimmed />
        </div>
      </div>
    </div>
  </div>
</template>
