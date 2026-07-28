import type { TaskTag } from '~~/shared/types'

export default function useTaskTags() {
  const {
    data: tags,
    pending: loading,
    refresh
  } = useLazyFetch<TaskTag[]>('/api/tasks/tags', {
    server: false
  })

  const toast = useToast()

  const createTag = async (name: string, color?: string) => {
    if (!name || !name.trim()) return

    try {
      const newTag = await $fetch<TaskTag>('/api/tasks/tags', {
        method: 'POST',
        body: { name: name.trim(), color }
      })
      toast.add({
        title: 'Tag créé',
        description: `Le tag "${name}" a été créé avec succès.`,
        color: 'success'
      })
      await refresh()
      return newTag
    } catch (err: any) {
      toast.add({
        title: 'Erreur',
        description: err?.data?.statusMessage || 'Impossible de créer le tag.',
        color: 'error'
      })
      throw err
    }
  }

  const deleteTag = async (id: number) => {
    try {
      await $fetch(`/api/tasks/tags/${id}`, {
        method: 'DELETE'
      })
      toast.add({
        title: 'Tag supprimé',
        description: 'Le tag a été supprimé avec succès.',
        color: 'success'
      })
      await refresh()
    } catch (err: any) {
      toast.add({
        title: 'Erreur',
        description: err?.data?.statusMessage || 'Impossible de supprimer le tag.',
        color: 'error'
      })
      throw err
    }
  }

  return {
    tags,
    loading,
    refresh,
    createTag,
    deleteTag
  }
}
