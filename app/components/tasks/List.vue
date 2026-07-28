<script setup lang="ts">
const { tasks, loading, refresh } = useTasks({
  perPage: 100 // On récupère tous les sujets de la roadmap
})

const toast = useToast()

const groupedTasks = computed(() => {
  const groups = {
    todo: [] as any[],
    pending: [] as any[],
    done: [] as any[]
  }
  if (!tasks.value) return groups

  for (const task of tasks.value) {
    if (task.status === 'todo') {
      groups.todo.push(task)
    } else if (task.status === 'pending') {
      groups.pending.push(task)
    } else if (task.status === 'done') {
      groups.done.push(task)
    }
  }
  return groups
})

defineExpose({
  refresh
})

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'todo':
      return 'À faire'
    case 'pending':
      return 'En attente'
    case 'done':
      return 'Terminé'
    default:
      return 'Inconnu'
  }
}

const changeTaskStatus = async (task: any, newStatus: string) => {
  try {
    await $fetch(`/api/tasks/${task.id}`, {
      method: 'PUT',
      body: { status: newStatus }
    })
    toast.add({
      title: 'Statut mis à jour',
      description: `Le sujet "${task.title}" est maintenant : ${getStatusLabel(newStatus)}.`,
      color: 'success'
    })
    refresh()
  } catch (err) {
    toast.add({
      title: 'Erreur',
      description: 'Impossible de changer le statut.',
      color: 'error'
    })
  }
}

const stripHtml = (html?: string) => {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '').trim()
}
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
          class="space-y-4 p-4 rounded-2xl bg-elevated/10 border border-default min-h-[500px]"
          v-auto-animate
        >
          <div
            v-if="groupedTasks.todo.length === 0"
            class="text-xs text-muted text-center py-12 italic border border-dashed border-default rounded-xl bg-default/40"
          >
            Aucun sujet à faire
          </div>

          <div
            v-for="task in groupedTasks.todo"
            :key="task.id"
            class="p-4 border border-default bg-elevated/50 hover:bg-elevated/80 rounded-xl transition-all shadow-sm hover:shadow flex flex-col gap-3 group"
          >
            <div class="flex flex-col gap-1 min-w-0">
              <NuxtLink
                :to="`/tasks/${task.id}`"
                class="font-bold text-highlighted hover:text-primary transition-colors text-base break-words"
              >
                {{ task.title }}
              </NuxtLink>
              <p v-if="task.content" class="text-xs text-muted line-clamp-2">
                {{ stripHtml(task.content) }}
              </p>
            </div>

            <div
              v-if="task.deadline"
              class="flex flex-wrap items-center gap-2 text-xs text-muted border-t border-dashed border-default/50 pt-3"
            >
              <UBadge color="info" variant="soft" class="flex items-center gap-1">
                <UIcon name="i-lucide-calendar" />
                {{ new Date(task.deadline).toLocaleDateString('fr-FR') }}
              </UBadge>
            </div>

            <div class="flex justify-between items-center gap-2 mt-1">
              <!-- Déplacer statut -->
              <div class="flex gap-1">
                <UButton
                  icon="i-lucide-clock"
                  color="warning"
                  variant="subtle"
                  size="xs"
                  title="Mettre en attente"
                  @click="changeTaskStatus(task, 'pending')"
                />
                <UButton
                  icon="i-lucide-circle-check"
                  color="success"
                  variant="subtle"
                  size="xs"
                  title="Marquer terminé"
                  @click="changeTaskStatus(task, 'done')"
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
          class="space-y-4 p-4 rounded-2xl bg-elevated/10 border border-default min-h-[500px]"
          v-auto-animate
        >
          <div
            v-if="groupedTasks.pending.length === 0"
            class="text-xs text-muted text-center py-12 italic border border-dashed border-default rounded-xl bg-default/40"
          >
            Aucun sujet en attente
          </div>

          <div
            v-for="task in groupedTasks.pending"
            :key="task.id"
            class="p-4 border border-default bg-elevated/50 hover:bg-elevated/80 rounded-xl transition-all shadow-sm hover:shadow flex flex-col gap-3 group"
          >
            <div class="flex flex-col gap-1 min-w-0">
              <NuxtLink
                :to="`/tasks/${task.id}`"
                class="font-bold text-highlighted hover:text-primary transition-colors text-base break-words"
              >
                {{ task.title }}
              </NuxtLink>
              <p v-if="task.content" class="text-xs text-muted line-clamp-2">
                {{ stripHtml(task.content) }}
              </p>
            </div>

            <div
              class="flex flex-wrap items-center gap-2 text-xs text-muted border-t border-dashed border-default/50 pt-3"
            >
              <UBadge
                v-if="task.deadline"
                color="info"
                variant="soft"
                size="xs"
                class="flex items-center gap-1"
              >
                <UIcon name="i-lucide-calendar" />
                {{ new Date(task.deadline).toLocaleDateString('fr-FR') }}
              </UBadge>
              <UBadge color="neutral" variant="soft" size="xs" class="flex items-center gap-1">
                <UIcon name="i-lucide-clock" />
                {{ new Date(task.createdAt).toLocaleDateString('fr-FR') }}
              </UBadge>
            </div>

            <div class="flex justify-between items-center gap-2 mt-1">
              <!-- Déplacer statut -->
              <div class="flex gap-1">
                <UButton
                  icon="i-lucide-circle"
                  color="info"
                  variant="subtle"
                  size="xs"
                  title="Remettre à faire"
                  @click="changeTaskStatus(task, 'todo')"
                />
                <UButton
                  icon="i-lucide-circle-check"
                  color="success"
                  variant="subtle"
                  size="xs"
                  title="Marquer terminé"
                  @click="changeTaskStatus(task, 'done')"
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
          class="space-y-4 p-4 rounded-2xl bg-elevated/10 border border-default min-h-[500px]"
          v-auto-animate
        >
          <div
            v-if="groupedTasks.done.length === 0"
            class="text-xs text-muted text-center py-12 italic border border-dashed border-default rounded-xl bg-default/40"
          >
            Aucun sujet terminé
          </div>

          <div
            v-for="task in groupedTasks.done"
            :key="task.id"
            class="p-4 border border-default bg-elevated/50 hover:bg-elevated/80 rounded-xl transition-all shadow-sm hover:shadow flex flex-col gap-3 opacity-80 group"
          >
            <div class="flex flex-col gap-1 min-w-0 line-through">
              <NuxtLink
                :to="`/tasks/${task.id}`"
                class="font-semibold text-muted hover:text-primary transition-colors text-base break-words"
              >
                {{ task.title }}
              </NuxtLink>
              <p v-if="task.content" class="text-xs text-muted line-clamp-2">
                {{ stripHtml(task.content) }}
              </p>
            </div>

            <div
              class="flex flex-wrap items-center gap-2 text-xs text-muted border-t border-dashed border-default/50 pt-3"
            >
              <UBadge
                v-if="task.deadline"
                color="info"
                variant="soft"
                size="xs"
                class="flex items-center gap-1"
              >
                <UIcon name="i-lucide-calendar" />
                {{ new Date(task.deadline).toLocaleDateString('fr-FR') }}
              </UBadge>
              <UBadge color="neutral" variant="soft" size="xs" class="flex items-center gap-1">
                <UIcon name="i-lucide-clock" />
                {{ new Date(task.createdAt).toLocaleDateString('fr-FR') }}
              </UBadge>
            </div>

            <div class="flex justify-between items-center gap-2 mt-1">
              <!-- Déplacer statut -->
              <div class="flex gap-1">
                <UButton
                  icon="i-lucide-circle"
                  color="info"
                  variant="subtle"
                  size="xs"
                  title="Remettre à faire"
                  @click="changeTaskStatus(task, 'todo')"
                />
                <UButton
                  icon="i-lucide-clock"
                  color="warning"
                  variant="subtle"
                  size="xs"
                  title="Remettre en attente"
                  @click="changeTaskStatus(task, 'pending')"
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
        </div>
      </div>
    </div>
  </div>
</template>
