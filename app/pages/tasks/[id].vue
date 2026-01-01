<script lang="ts" setup>
import type { Task } from '~~/shared/types'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const taskId = computed(() => Number(route.params.id))

const { data: task, error } = useLazyAsyncData<Task>(
  () => `task-${taskId.value}`,
  () => $fetch(`/api/tasks/${taskId.value}`),
  { server: false }
)

const statusBadge = computed(() => {
  if (!task.value) return { label: 'En cours', color: 'warning' as const }
  return task.value.isDone
    ? { label: 'Terminée', color: 'success' as const }
    : { label: 'À faire', color: 'warning' as const }
})

const meta = computed(() => [
  {
    label: 'Statut',
    value: statusBadge.value.label,
    color: statusBadge.value.color,
    icon: task.value?.isDone ? 'i-lucide-badge-check' : 'i-lucide-hourglass'
  },
  {
    label: 'Échéance',
    value: task.value?.deadline ? new Date(task.value.deadline).toLocaleString() : 'Non définie',
    icon: 'i-lucide-calendar-clock'
  },
  {
    label: 'Créée le',
    value: task.value?.createdAt ? new Date(task.value.createdAt).toLocaleString() : '—',
    icon: 'i-lucide-clock-4'
  }
])

const onEdit = () => {
  console.warn('Modifier la tâche', taskId.value)
}

const onDelete = () => {
  console.warn('Supprimer la tâche', taskId.value)
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
            <UButton icon="i-lucide-pencil-line" color="primary" variant="soft" @click="onEdit">
              Modifier
            </UButton>
            <UButton icon="i-lucide-trash-2" color="error" variant="ghost" @click="onDelete">
              Supprimer
            </UButton>
          </div>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="w-full max-w-3xl mx-auto space-y-6">
        <UAlert
          v-if="error"
          icon="i-lucide-circle-alert"
          color="error"
          variant="soft"
          title="Impossible de charger la tâche"
          :description="error?.data?.statusMessage || error?.message"
        />

        <div v-else class="space-y-6">
          <UPageCard
            :title="task?.content || 'Chargement...'"
            orientation="horizontal"
            :ui="{ container: 'lg:grid-cols-[auto_auto]' }"
          >
            <UCheckbox size="xl" class="mx-auto" />

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
                <span>Description</span>
              </div>
            </template>

            <UInput variant="ghost" placeholder="Ajouter des détails..." class="w-full" />
          </UCard>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
