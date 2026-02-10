export default function () {
  const route = useRoute()
  
  const toast = useToast()

  const summaryId = Number(route.params.id)
  const summary = ref<SummaryWithLinks>()
  const loading = ref(true)
  
  const getSummary = async () => {
    loading.value = true
    try {
      summary.value = await $fetch<SummaryWithLinks>(`/api/summary/${summaryId}`)
    } catch {
      toast.add({
        title: 'Erreur',
        description: 'Impossible de charger le résumé',
        color: 'error'
      })
    } finally {
      loading.value = false
    }
  }

  return {
    getSummary,
    loading,
    summary,
    summaryId,
  }
}