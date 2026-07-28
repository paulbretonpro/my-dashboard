export default function () {
  const route = useRoute()

  const toast = useToast()

  const summaryId = Number(route.params.id)
  const summary = ref<SummaryWithLinks>()
  const loading = ref(true)
  const error = ref(false)

  const getSummary = async () => {
    error.value = false
    loading.value = true
    try {
      summary.value = await $fetch<SummaryWithLinks>(`/api/summary/${summaryId}`)
    } catch {
      toast.add({
        title: 'Erreur',
        description: 'Impossible de charger le résumé',
        color: 'error'
      })
      error.value = true
    } finally {
      loading.value = false
    }
  }

  return {
    error,
    getSummary,
    loading,
    summary,
    summaryId
  }
}
