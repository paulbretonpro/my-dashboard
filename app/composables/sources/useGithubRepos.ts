import { ref } from 'vue'

export default function useGithubRepos() {
  const toast = useToast()

  const { data: repos, pending: loading, refresh } = useFetch('/api/github/repos', {
    key: 'github-repos',
    headers: useRequestHeaders(['cookie'])
  })

  const newRepoUrl = ref('')
  const isSubmitting = ref(false)

  const handleAddRepo = async () => {
    if (!newRepoUrl.value.trim()) return
    isSubmitting.value = true

    try {
      await $fetch('/api/github/repos', {
        method: 'POST',
        body: { url: newRepoUrl.value.trim() }
      })

      toast.add({
        title: 'Succès',
        description: 'Dépôt GitHub ajouté avec succès.',
        color: 'success'
      })

      newRepoUrl.value = ''
      refresh()
    } catch (err: any) {
      toast.add({
        title: 'Erreur',
        description: err?.data?.statusMessage || 'Impossible de suivre ce dépôt.',
        color: 'error'
      })
    } finally {
      isSubmitting.value = false
    }
  }

  const handleRemoveRepo = async (id: number, fullName: string) => {
    try {
      await $fetch(`/api/github/${id}`, {
        method: 'DELETE'
      })

      toast.add({
        title: 'Dépôt retiré',
        description: `Vous ne suivez plus ${fullName}.`,
        color: 'success'
      })

      refresh()
    } catch (err: any) {
      toast.add({
        title: 'Erreur',
        description: 'Impossible de retirer ce dépôt.',
        color: 'error'
      })
    }
  }

  return {
    repos,
    loading,
    refresh,
    newRepoUrl,
    isSubmitting,
    handleAddRepo,
    handleRemoveRepo
  }
}
