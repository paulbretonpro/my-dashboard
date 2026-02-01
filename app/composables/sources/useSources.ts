export default function (options: { server?: boolean, withPagination?: boolean } = { withPagination: true }) {
  const pagination = ref({
    page: 1,
    perPage: 10
  })

  const query = computed(() => options.withPagination ? ({
      page: pagination.value.page,
      perPage: pagination.value.perPage
    }) : {}
  )

  const { data, status, refresh } = useLazyFetch<PaginatedResponse<RssSource>>('/api/rss', {
    query
  })

  const sources = computed(() => data.value?.data || [])
  const total = computed(() => data.value?.total || 0)

  const loading = computed(() => isLoading(status.value))

  return {
    sources,
    total,
    pagination,
    loading,
    refresh
  }
}