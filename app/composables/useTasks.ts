import { useDebounceFn } from '@vueuse/core'
import { tasks as tasksTable } from '~~/server/db/schema'
import { AppFetchKeysEnum, type TaskFilters, type TaskListResponse } from '~~/shared/types'

const normalizeDate = (value?: string | Date) => {
  if (!value) return undefined
  const parsed = typeof value === 'string' ? new Date(value) : value
  return Number.isNaN(parsed?.getTime()) ? undefined : parsed.toISOString()
}

export default function (options?: TaskFilters & { immediate?: boolean }) {
  const immediate = options?.immediate || true

  const filters = ref<TaskFilters>({
    createdAt: options?.createdAt,
    createdBefore: options?.createdBefore,
    deadline: options?.deadline,
    descending: options?.descending ?? false,
    pageId: options?.pageId,
    search: options?.search,
    sortBy: options?.sortBy ?? tasksTable.createdAt.name,
    status: options?.status ?? 'all'
  })

  const pagination = ref({
    page: options?.page || 1,
    perPage: options?.perPage || 10
  })

  const queryParams = computed<TaskFilters>(() => ({
    createdAt: normalizeDate(filters.value.createdAt),
    createdBefore: normalizeDate(filters.value.createdBefore),
    deadline: normalizeDate(filters.value.deadline),
    descending: filters.value.descending,
    page: filters.value.page,
    pageId: filters.value.pageId,
    perPage: filters.value.perPage,
    search: filters.value.search?.trim() || undefined,
    sortBy: filters.value.sortBy,
    status: filters.value.status === 'all' ? undefined : filters.value.status
  }))

  const {
    data: tasksResponse,
    pending,
    error,
    refresh,
    status
  } = useLazyAsyncData<TaskListResponse>(
    computed(() => AppFetchKeysEnum.TASKS + JSON.stringify(queryParams.value)),
    () => $fetch('/api/tasks', { params: queryParams.value }),
    {
      default: () => ({ data: [], total: 0 }),
      watch: [queryParams],
      server: false
    }
  )

  watch(filters, () => (filters.value.page = 1), { deep: true })

  const tasks = computed(() => tasksResponse.value?.data || [])
  const total = computed(() => tasksResponse.value?.total || 0)

  const updateSearch = useDebounceFn((value: string) => {
    filters.value.search = value?.trim() ? value : undefined
    filters.value.page = 1
  }, 300)

  return {
    error,
    filters,
    pending,
    refresh,
    status,
    tasks,
    total,
    updateSearch
  }
}
