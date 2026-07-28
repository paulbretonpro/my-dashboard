<script setup lang="ts">
import { TaskSortByEnum } from '~~/shared/types'

// On récupère tous les sujets de la roadmap pour pouvoir filtrer et calculer la progression de la semaine
const { tasks, loading, refresh } = useTasks({
  sortBy: TaskSortByEnum.DEADLINE,
  descending: false,
  perPage: 100
})

const toast = useToast()
const currentView = ref<'timeline' | 'cards' | 'progress'>('timeline')

// Définition de la plage de la semaine courante (du lundi au dimanche)
const getWeekRange = () => {
  const now = new Date()

  const startOfWeek = new Date(now)
  startOfWeek.setHours(0, 0, 0, 0)

  const day = startOfWeek.getDay()
  // diff ramène au lundi de la semaine courante
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1)
  startOfWeek.setDate(diff)

  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  endOfWeek.setHours(23, 59, 59, 999)

  return { startOfWeek, endOfWeek }
}

// Tous les sujets de la semaine courante (lundi au dimanche)
const thisWeeksTasks = computed(() => {
  if (!tasks.value) return []
  const { startOfWeek, endOfWeek } = getWeekRange()

  return tasks.value.filter((task) => {
    if (!task.deadline) return false
    const deadlineDate = new Date(task.deadline)
    return deadlineDate >= startOfWeek && deadlineDate <= endOfWeek
  })
})

// Sujets actifs de la semaine courante (todo & pending)
const activeTasks = computed(() => {
  return thisWeeksTasks.value.filter((task) => task.status === 'todo' || task.status === 'pending')
})

// Statistiques de progression de la semaine
const progressStats = computed(() => {
  const total = thisWeeksTasks.value.length
  const done = thisWeeksTasks.value.filter((t) => t.status === 'done').length
  const percentage = total > 0 ? Math.round((done / total) * 100) : 0
  return { total, done, percentage }
})

// Grouper les sujets actifs par jour de la semaine pour la Timeline (Proposition 1)
const timelineDays = computed(() => {
  const daysMap: Record<string, any[]> = {}

  for (const task of activeTasks.value) {
    if (!task.deadline) continue
    const dateStr = new Date(task.deadline).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'short'
    })
    const formattedDay = dateStr.charAt(0).toUpperCase() + dateStr.slice(1)

    if (!daysMap[formattedDay]) {
      daysMap[formattedDay] = []
    }
    daysMap[formattedDay].push(task)
  }

  return Object.entries(daysMap).map(([day, items]) => ({ day, items }))
})

// On mappe les jours de la timeline vers le format d'items de UTimeline de Nuxt UI
const timelineItems = computed(() => {
  return timelineDays.value.map((group) => ({
    title: group.day,
    icon: 'i-lucide-calendar-days',
    tasks: group.items
  }))
})

// Formater la date en texte naturel relatif pour les Cartes (Proposition 2)
const getRelativeDaysString = (deadlineStr: string | Date | null | undefined) => {
  if (!deadlineStr) return ''
  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const deadline = new Date(deadlineStr)
  deadline.setHours(0, 0, 0, 0)

  const diffTime = deadline.getTime() - now.getTime()
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return `En retard (${Math.abs(diffDays)}j)`
  } else if (diffDays === 0) {
    return "Aujourd'hui"
  } else if (diffDays === 1) {
    return 'Demain'
  } else if (diffDays === 2) {
    return 'Après-demain'
  } else {
    return `Dans ${diffDays} jours`
  }
}

// Couleurs de fiches adaptées selon l'urgence pour les Cartes (Proposition 2)
const getCardUrgencyClass = (deadlineStr: string | Date | null | undefined) => {
  if (!deadlineStr) return 'border-l-4 border-info bg-info/5 sm:hover:bg-info/10'
  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const deadline = new Date(deadlineStr)
  deadline.setHours(0, 0, 0, 0)

  const diffTime = deadline.getTime() - now.getTime()
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return 'border-l-4 border-error bg-error/5 sm:hover:bg-error/10'
  } else if (diffDays === 0 || diffDays === 1) {
    return 'border-l-4 border-warning bg-warning/5 sm:hover:bg-warning/10'
  } else {
    return 'border-l-4 border-info bg-info/5 sm:hover:bg-info/10'
  }
}

const stripHtml = (html?: string) => {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '').trim()
}

// Changer de statut rapidement (utile pour la proposition 3 gamifiée)
const changeTaskStatus = async (task: any, newStatus: string) => {
  try {
    await $fetch(`/api/tasks/${task.id}`, {
      method: 'PUT',
      body: { status: newStatus }
    })
    toast.add({
      title: 'Roadmap mise à jour',
      description: `Le sujet "${task.title}" est maintenant marqué comme ${newStatus === 'done' ? 'terminé' : 'à faire'}.`,
      color: 'success'
    })
    refresh()
  } catch (err) {
    toast.add({
      title: 'Erreur',
      description: 'Impossible de mettre à jour le statut.',
      color: 'error'
    })
  }
}
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
          label="Timeline"
          icon="i-lucide-git-commit"
          color="neutral"
          :variant="currentView === 'timeline' ? 'solid' : 'ghost'"
          size="xs"
          @click="currentView = 'timeline'"
        />
        <UButton
          label="Fiches"
          icon="i-lucide-layout-grid"
          color="neutral"
          :variant="currentView === 'cards' ? 'solid' : 'ghost'"
          size="xs"
          @click="currentView = 'cards'"
        />
        <UButton
          label="Progression"
          icon="i-lucide-trending-up"
          color="neutral"
          :variant="currentView === 'progress' ? 'solid' : 'ghost'"
          size="xs"
          @click="currentView = 'progress'"
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
      <!-- PROPOSITION 1 : TIMELINE (UTimeline) -->
      <div v-if="currentView === 'timeline'" class="space-y-6" v-auto-animate>
        <div v-if="activeTasks.length === 0" class="text-center py-8 italic text-xs text-muted">
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
                  <span class="text-xs text-muted"
                    >Statut : {{ task.status === 'todo' ? 'À faire' : 'En attente' }}</span
                  >
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

      <!-- PROPOSITION 2 : CARDS -->
      <div v-else-if="currentView === 'cards'" v-auto-animate>
        <div v-if="activeTasks.length === 0" class="text-center py-8 italic text-xs text-muted">
          Tous les sujets de la semaine sont terminés ! 🎉
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="task in activeTasks"
            :key="task.id"
            class="p-4 border border-default bg-elevated/50 hover:bg-elevated/80 rounded-xl transition-all shadow-sm hover:shadow flex flex-col gap-3 group"
          >
            <div class="flex flex-col gap-1 min-w-0">
              <div class="flex justify-between items-start gap-4">
                <NuxtLink
                  :to="`/tasks/${task.id}`"
                  class="font-bold text-highlighted hover:text-primary transition-colors text-base break-words"
                >
                  {{ task.title }}
                </NuxtLink>
                <UBadge :color="task.status === 'todo' ? 'info' : 'warning'" variant="soft" size="xs">
                  {{ task.status === 'todo' ? 'À faire' : 'En attente' }}
                </UBadge>
              </div>
              <p v-if="task.content" class="text-xs text-muted line-clamp-2 mt-1">
                {{ stripHtml(task.content) }}
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-2 text-xs text-muted border-t border-dashed border-default/50 pt-3">
              <UBadge v-if="task.deadline" color="info" variant="soft" size="xs" class="flex items-center gap-1">
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
                  v-if="task.status === 'todo'"
                  icon="i-lucide-clock"
                  color="warning"
                  variant="subtle"
                  size="xs"
                  title="Mettre en attente"
                  @click="changeTaskStatus(task, 'pending')"
                />
                <UButton
                  v-if="task.status === 'pending'"
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

      <!-- PROPOSITION 3 : PROGRESS GAMIFIÉ -->
      <div
        v-else-if="currentView === 'progress'"
        class="grid grid-cols-1 md:grid-cols-3 gap-6"
        v-auto-animate
      >
        <!-- Anneau de progression circular SVG -->
        <div
          class="md:col-span-1 flex flex-col items-center justify-center p-6 border border-default bg-elevated/40 rounded-2xl text-center space-y-4"
        >
          <h4 class="text-sm font-bold text-highlighted">Progression Hebdomadaire</h4>

          <div class="relative flex items-center justify-center">
            <!-- SVG Cercle de progression -->
            <svg class="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="50"
                stroke="currentColor"
                class="text-default/20"
                stroke-width="8"
                fill="transparent"
              />
              <circle
                cx="64"
                cy="64"
                r="50"
                stroke="currentColor"
                class="text-primary transition-all duration-500 ease-out"
                stroke-width="8"
                fill="transparent"
                :stroke-dasharray="2 * Math.PI * 50"
                :stroke-dashoffset="2 * Math.PI * 50 * (1 - progressStats.percentage / 100)"
                stroke-linecap="round"
              />
            </svg>
            <div class="absolute flex flex-col items-center justify-center">
              <span class="text-2xl font-black text-highlighted"
                >{{ progressStats.percentage }}%</span
              >
              <span class="text-[10px] text-muted font-bold">Complété</span>
            </div>
          </div>

          <p class="text-xs text-muted">
            <strong>{{ progressStats.done }}</strong> sur
            <strong>{{ progressStats.total }}</strong> sujets terminés cette semaine.
          </p>
        </div>

        <!-- Liste d'action simplifiée -->
        <div class="md:col-span-2 space-y-3" v-auto-animate>
          <h4 class="text-xs font-bold text-muted pb-1">Sujets actifs restants</h4>

          <div
            v-if="activeTasks.length === 0"
            class="text-center py-12 border border-dashed border-default rounded-xl bg-success/5 text-success"
          >
            <UIcon name="i-lucide-party-popper" class="text-3xl" />
            <h5 class="font-bold mt-2">Semaine bouclée !</h5>
            <p class="text-xs opacity-80 mt-0.5">
              Tous les sujets de la semaine ont été brillamment traités.
            </p>
          </div>

          <div v-else class="space-y-2">
            <div
              v-for="task in activeTasks"
              :key="task.id"
              class="p-4 border border-default bg-elevated/40 hover:bg-elevated/70 rounded-xl transition-all shadow-sm flex items-center justify-between gap-4"
            >
              <div class="flex items-center gap-3 min-w-0">
                <!-- Case à cocher rapide d'achèvement -->
                <UButton
                  icon="i-lucide-circle"
                  color="neutral"
                  variant="ghost"
                  size="sm"
                  class="text-muted hover:text-success flex-shrink-0"
                  title="Marquer comme complété"
                  @click="changeTaskStatus(task, 'done')"
                />

                <div class="flex flex-col gap-0.5 min-w-0">
                  <NuxtLink
                    :to="`/tasks/${task.id}`"
                    class="font-semibold text-highlighted hover:text-primary transition-colors text-sm truncate"
                  >
                    {{ task.title }}
                  </NuxtLink>
                  <span class="text-[10px] text-muted font-medium flex items-center gap-1">
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
