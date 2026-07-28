import { computed } from 'vue'
import { TaskSortByEnum } from '~~/shared/types'

export default function useRoadmap() {
  const { tasks, loading, refresh } = useTasks({
    sortBy: TaskSortByEnum.DEADLINE,
    descending: false,
    perPage: 100
  })

  const toast = useToast()

  // Définition de la plage de la semaine courante (du lundi au dimanche)
  const getWeekRange = () => {
    const now = new Date()

    const startOfWeek = new Date(now)
    startOfWeek.setHours(0, 0, 0, 0)

    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1)
    startOfWeek.setDate(diff)

    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    endOfWeek.setHours(23, 59, 59, 999)

    return { startOfWeek, endOfWeek }
  }

  // Groupement des sujets par statut pour le Kanban
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

  // Tous les sujets de la semaine courante
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
  const activeWeeksTasks = computed(() => {
    return thisWeeksTasks.value.filter(
      (task) => task.status === 'todo' || task.status === 'pending'
    )
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

    for (const task of activeWeeksTasks.value) {
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

  // Formater la date en texte naturel relatif
  const getRelativeDaysString = (deadlineStr?: string | Date | null) => {
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

  // Nettoyage HTML pour extrait textuel
  const stripHtml = (html?: string) => {
    if (!html) return ''
    return html.replace(/<[^>]*>/g, '').trim()
  }

  // Changer de statut rapidement avec Toast et Refresh
  const changeTaskStatus = async (task: any, newStatus: string) => {
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

    try {
      await $fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        body: { status: newStatus }
      })
      toast.add({
        title: 'Roadmap mise à jour',
        description: `Le sujet "${task.title}" est maintenant : ${getStatusLabel(newStatus)}.`,
        color: 'success'
      })
      refresh()
    } catch (err) {
      toast.add({
        title: 'Erreur',
        description: 'Impossible de modifier le statut.',
        color: 'error'
      })
    }
  }

  return {
    tasks,
    loading,
    refresh,
    groupedTasks,
    thisWeeksTasks,
    activeWeeksTasks,
    timelineItems,
    progressStats,
    getWeekRange,
    getRelativeDaysString,
    stripHtml,
    changeTaskStatus
  }
}
