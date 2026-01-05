export default function useUpdateTask(task: Task) {
  const loading = ref(false)
  const error = ref()

  const updateIsDone = async (isDone: boolean) => {
    if (!task) return

    try {
      loading.value = true
      const taskUpdated = await $fetch<TaskWithPage>(`/api/tasks/${task.id}`, {
        method: 'PUT',
        body: { isDone }
      })

      return taskUpdated
    } catch (err) {
      console.error('Failed to update task status:', err)

      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateAdditionnalNotes = async (additionalNotes?: string) => {
    if (!task) return

    try {
      loading.value = true
      const taskUpdated = await $fetch<TaskWithPage>(`/api/tasks/${task.id}`, {
        method: 'PUT',
        body: { additionalNotes: additionalNotes || '' }
      })

      return taskUpdated
    } catch (err) {
      console.error('Failed to update task status:', err)

      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  const resetError = () => (error.value = undefined)

  return {
    error,
    loading,
    updateIsDone,
    updateAdditionnalNotes,
    resetError
  }
}
