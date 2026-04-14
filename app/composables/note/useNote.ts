export default function () {
  const route = useRoute()
  
  const toast = useToast()

  const noteId = Number(route.params.id)
  const note = ref<Note>()
  const loading = ref(true)
  const error = ref(false)
  
  const getNote = async () => {
    error.value = false
    loading.value = true
    try {
      note.value = await $fetch<Note>(`/api/notes/${noteId}`)
    } catch {
      toast.add({
        title: 'Erreur',
        description: 'Impossible de charger la note',
        color: 'error'
      })
      error.value = true
    } finally {
      loading.value = false
    }
  }

  return {
    error,
    getNote,
    loading,
    note,
    noteId,
  }
}