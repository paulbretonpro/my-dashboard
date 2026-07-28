export default function useUpdateTask(task: Task) {
  const { setLayoutLoading } = useLayoutStore()

  const loading = ref(false)
  const error = ref()

  const updateTask = async (payload: Partial<Omit<Task, 'id' | 'userId' | 'createdAt'>>) => {
    if (!task) return

    try {
      loading.value = true
      setLayoutLoading(true)
      const taskUpdated = await $fetch<Task>(`/api/tasks/${task.id}`, {
        method: 'PUT',
        body: payload
      })

      return taskUpdated
    } catch (err) {
      console.error('Failed to update task:', err)

      error.value = err
      throw err
    } finally {
      loading.value = false
      setLayoutLoading(false)
    }
  }

  const resetError = () => (error.value = undefined)

  return {
    error,
    loading,
    updateTask,
    resetError
  }
}
