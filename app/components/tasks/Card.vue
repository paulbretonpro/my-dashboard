<script setup lang="ts">
const props = defineProps<{
  task: any
  dimmed?: boolean
}>()

const emit = defineEmits(['status-change'])

// On injecte la méthode de mise à jour fournie par le parent (Kanban ou Dashboard)
// pour éviter d'instancier useRoadmap et de dupliquer les appels API de chargement au montage
const changeTaskStatus = inject<any>('changeTaskStatus', null)

const stripHtml = (html?: string) => {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '').trim()
}

const handleStatusChange = async (newStatus: string) => {
  if (changeTaskStatus) {
    await changeTaskStatus(props.task, newStatus)
  } else {
    // Repli autonome si le composant est utilisé isolément
    try {
      await $fetch(`/api/tasks/${props.task.id}`, {
        method: 'PUT',
        body: { status: newStatus }
      })
      emit('status-change', newStatus)
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }
}
</script>

<template>
  <div
    :class="[
      'p-4 border border-default bg-elevated/50 hover:bg-elevated/80 rounded-xl transition-all shadow-sm hover:shadow flex flex-col gap-3 group w-full',
      { 'opacity-80': dimmed }
    ]"
  >
    <div class="flex flex-col gap-1 min-w-0">
      <div class="flex justify-between items-start gap-4" :class="{ 'line-through': dimmed }">
        <NuxtLink
          :to="`/tasks/${task.id}`"
          :class="[
            'font-bold hover:text-primary transition-colors text-base break-words',
            dimmed ? 'text-muted' : 'text-highlighted'
          ]"
        >
          {{ task.title }}
        </NuxtLink>
        <UBadge
          :color="
            task.status === 'done' ? 'success' : task.status === 'pending' ? 'warning' : 'info'
          "
          variant="soft"
        >
          {{
            task.status === 'done'
              ? 'Terminé'
              : task.status === 'pending'
                ? 'En attente'
                : 'À faire'
          }}
        </UBadge>
      </div>
      <p
        v-if="task.content"
        class="text-xs text-muted line-clamp-2 mt-1"
        :class="{ 'line-through': dimmed }"
      >
        {{ stripHtml(task.content) }}
      </p>
    </div>

    <div
      class="flex flex-wrap items-center gap-2 text-xs text-muted border-t border-dashed border-default/50 pt-3"
    >
      <UBadge
        v-if="task.deadline"
        :color="dimmed ? 'neutral' : 'info'"
        variant="soft"
        class="flex items-center gap-1"
      >
        <UIcon name="i-lucide-calendar" />
        {{ new Date(task.deadline).toLocaleDateString('fr-FR') }}
      </UBadge>
      <UBadge color="neutral" variant="soft" class="flex items-center gap-1">
        <UIcon name="i-lucide-clock" />
        {{ new Date(task.createdAt).toLocaleDateString('fr-FR') }}
      </UBadge>
    </div>

    <div class="flex justify-between items-center gap-2 mt-1">
      <!-- Actions rapides d'état -->
      <div class="flex gap-1">
        <UButton
          v-if="task.status !== 'todo'"
          icon="i-lucide-circle"
          color="info"
          variant="subtle"
          title="Remettre à faire"
          @click="handleStatusChange('todo')"
        />
        <UButton
          v-if="task.status !== 'pending'"
          icon="i-lucide-clock"
          color="warning"
          variant="subtle"
          title="Mettre en attente"
          @click="handleStatusChange('pending')"
        />
        <UButton
          v-if="task.status !== 'done'"
          icon="i-lucide-circle-check"
          color="success"
          variant="subtle"
          title="Marquer terminé"
          @click="handleStatusChange('done')"
        />
      </div>

      <UButton
        icon="i-lucide-square-pen"
        color="neutral"
        variant="ghost"
        size="sm"
        :to="`/tasks/${task.id}`"
      />
    </div>
  </div>
</template>
