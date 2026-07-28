<script setup lang="ts">
const {
  loading,
  activeWeeksTasks,
  thisWeeksTasks,
  timelineItems,
  progressStats,
  getRelativeDaysString,
  changeTaskStatus
} = useRoadmap()

provide('changeTaskStatus', changeTaskStatus)

const currentView = ref<'timeline' | 'cards' | 'progress'>('timeline')

// Trier les sujets de la semaine pour placer ceux terminés (done) à la fin
const sortedWeeksTasks = computed(() => {
  if (!thisWeeksTasks.value) return []
  return [...thisWeeksTasks.value].sort((a, b) => {
    const aDone = a.status === 'done' ? 1 : 0
    const bDone = b.status === 'done' ? 1 : 0
    return aDone - bDone
  })
})
</script>

<template>
  <div class="space-y-6">
    <!-- Sélecteur de design (Segmented Control) -->
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-default"
    >
      <div class="flex flex-col gap-0.5">
        <h3 class="text-sm font-bold text-highlighted">Échéances de la semaine</h3>
        <p class="text-xs text-muted">Choisissez votre affichage favori parmi nos prototypes</p>
      </div>

      <div class="flex bg-elevated border border-default p-1 rounded-lg gap-1">
        <UButton
          label="Progression"
          icon="i-lucide-trending-up"
          color="neutral"
          :variant="currentView === 'progress' ? 'solid' : 'ghost'"
          @click="currentView = 'progress'"
        />
        <UButton
          label="Timeline"
          icon="i-lucide-git-commit"
          color="neutral"
          :variant="currentView === 'timeline' ? 'solid' : 'ghost'"
          @click="currentView = 'timeline'"
        />
        <UButton
          label="Grille"
          icon="i-lucide-layout-grid"
          color="neutral"
          :variant="currentView === 'cards' ? 'solid' : 'ghost'"
          @click="currentView = 'cards'"
        />
      </div>
    </div>

    <!-- Mode de chargement global -->
    <div v-if="loading && thisWeeksTasks.length === 0" class="text-center py-12 text-muted">
      <UIcon name="i-lucide-loader-circle" class="animate-spin text-2xl" />
      <p class="mt-2 text-sm">Chargement des échéances...</p>
    </div>

    <!-- Mode vide global -->
    <div
      v-else-if="thisWeeksTasks.length === 0"
      class="text-center py-12 border border-dashed border-default rounded-xl bg-elevated/20"
    >
      <UIcon name="i-lucide-calendar" class="text-3xl text-muted" />
      <h4 class="mt-2 font-semibold text-highlighted">Aucun sujet cette semaine</h4>
      <p class="text-xs text-muted mt-1">
        Vous n'avez aucun sujet à traiter planifié pour cette semaine.
      </p>
    </div>

    <!-- Rendu des différents designs -->
    <div v-else>
      <div v-if="currentView === 'timeline'" class="space-y-6" v-auto-animate>
        <div
          v-if="activeWeeksTasks.length === 0"
          class="text-center py-8 italic text-xs text-muted"
        >
          Tous les sujets de la semaine sont terminés ! 🎉
        </div>

        <UTimeline v-else :items="timelineItems" color="primary" class="ml-2">
          <template #description="{ item }">
            <div class="grid grid-cols-1 gap-3 mt-2">
              <div
                v-for="task in (item as any).tasks"
                :key="task.id"
                class="p-4 border border-default bg-elevated/40 hover:bg-elevated/80 rounded-xl transition-all shadow-sm flex items-center justify-between gap-4"
              >
                <div class="flex flex-col gap-1 min-w-0">
                  <NuxtLink
                    :to="`/tasks/${task.id}`"
                    class="font-semibold text-highlighted hover:text-primary transition-colors text-sm truncate"
                  >
                    {{ task.title }}
                  </NuxtLink>
                  <span class="text-xs text-muted">
                    Statut : {{ task.status === 'todo' ? 'À faire' : 'En attente' }}
                  </span>
                </div>
                <UButton
                  icon="i-lucide-chevron-right"
                  color="neutral"
                  variant="ghost"
                  size="sm"
                  :to="`/tasks/${task.id}`"
                />
              </div>
            </div>
          </template>
        </UTimeline>
      </div>

      <div v-else-if="currentView === 'cards'" v-auto-animate>
        <div
          v-if="activeWeeksTasks.length === 0"
          class="text-center py-8 italic text-xs text-muted"
        >
          Tous les sujets de la semaine sont terminés ! 🎉
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TasksCard v-for="task in activeWeeksTasks" :key="task.id" :task="task" />
        </div>
      </div>

      <!-- PROPOSITION 3 : PROGRESS GAMIFIÉ -->
      <div
        v-else-if="currentView === 'progress'"
        class="grid grid-cols-1 md:grid-cols-3 gap-6"
        v-auto-animate
      >
        <!-- Anneau de progression circular SVG -->
        <TasksWeeklyProgress v-bind="progressStats" class="md:col-span-1" />

        <!-- Liste d'action simplifiée -->
        <div class="md:col-span-2 space-y-3" v-auto-animate>
          <h4 class="text-xs font-bold text-muted uppercase tracking-wider pb-1">
            Sujets de la semaine
          </h4>

          <div class="space-y-2">
            <div
              v-for="task in sortedWeeksTasks"
              :key="task.id"
              :class="[
                'p-4 border border-default bg-elevated/40 hover:bg-elevated/70 rounded-xl transition-all shadow-sm flex items-center justify-between gap-4',
                { 'opacity-60': task.status === 'done' }
              ]"
            >
              <div class="flex items-center gap-3 min-w-0">
                <!-- Case à cocher rapide d'achèvement interactive -->
                <UButton
                  :icon="task.status === 'done' ? 'i-lucide-circle-check' : 'i-lucide-circle'"
                  :color="task.status === 'done' ? 'success' : 'neutral'"
                  variant="ghost"
                  size="sm"
                  class="flex-shrink-0"
                  :class="
                    task.status === 'done' ? 'text-success-500' : 'text-muted hover:text-success'
                  "
                  :title="task.status === 'done' ? 'Réouvrir le sujet' : 'Marquer comme complété'"
                  @click="changeTaskStatus(task, task.status === 'done' ? 'todo' : 'done')"
                />

                <div class="flex flex-col gap-0.5 min-w-0">
                  <NuxtLink
                    :to="`/tasks/${task.id}`"
                    class="font-semibold hover:text-primary transition-colors text-sm truncate"
                    :class="task.status === 'done' ? 'line-through text-muted' : 'text-highlighted'"
                  >
                    {{ task.title }}
                  </NuxtLink>
                  <span
                    class="text-[10px] text-muted font-medium flex items-center gap-1"
                    :class="{ 'line-through': task.status === 'done' }"
                  >
                    <UIcon name="i-lucide-clock" />
                    {{ getRelativeDaysString(task.deadline) }}
                  </span>
                </div>
              </div>

              <UButton
                icon="i-lucide-chevron-right"
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
