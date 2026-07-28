import { useDebounceFn } from '@vueuse/core'
import {
  TaskSortByEnum,
  type TaskFilters,
  type TaskListResponse,
  type TaskWithPage
} from '~~/shared/types'

const normalizeDate = (value?: string | Date) => {
  if (!value) return undefined
  const parsed = typeof value === 'string' ? new Date(value) : value
  return Number.isNaN(parsed?.getTime()) ? undefined : parsed.toISOString()
}

export default function (options?: TaskFilters & { immediate?: boolean }) {
  const immediate = options?.immediate ?? true

  const tasks = ref<TaskWithPage[]>([])
  const total = ref<number>(0)
  const loading = ref<boolean>(true)
  const error = ref()

  const lastRequest = ref<TaskFilters & { page: number; perPage: number }>()

  const filters = ref<TaskFilters>({
    createdAt: options?.createdAt,
    createdBefore: options?.createdBefore,
    deadline: options?.deadline,
    descending: options?.descending ?? false,
    search: options?.search,
    sortBy: options?.sortBy ?? TaskSortByEnum.CREATED_AT,
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
    search: filters.value.search?.trim() || undefined,
    sortBy: filters.value.sortBy,
    status: filters.value.status === 'all' ? undefined : filters.value.status
  }))

  const fetchParams = computed(() => ({
    ...queryParams.value,
    ...pagination.value
  }))

  const runRequest = async (params: TaskFilters & { page: number; perPage: number }) => {
    loading.value = true
    lastRequest.value = params

    try {
      const response = await $fetch<TaskListResponse>('/api/tasks', { query: params })

      tasks.value = response.data
      total.value = response.total
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  const getTasks = async () => {
    await runRequest(fetchParams.value)
  }

  const refresh = async (task?: TaskWithPage) => {
    // On refresh uniquement la tache mise à jour
    if (task) {
      const index = tasks.value.findIndex(t => t.id === task.id)
      if (index !== -1) {
        tasks.value[index] = task
      }
      return
    }

    // Sinon on relance la dernière requête
    if (lastRequest.value) {
      await runRequest(lastRequest.value)
      return
    }

    // Ou on lance une nouvelle requête
    await getTasks()
  }

  watch(
    queryParams,
    () => {
      if (pagination.value.page !== 1) {
        pagination.value.page = 1
        return
      }

      getTasks()
    },
    { deep: true }
  )

  watch(
    pagination,
    () => {
      getTasks()
    },
    { deep: true }
  )

  const updateSearch = useDebounceFn((value: string) => {
    filters.value.search = value?.trim() ? value : undefined
    pagination.value.page = 1
  }, 300)

  onMounted(() => {
    if (immediate) {
      getTasks()
    }
  })

  return {
    error,
    filters,
    pagination,
    loading,
    refresh,
    tasks,
    total,
    updateSearch
  }
}
