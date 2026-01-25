import { defineStore } from 'pinia'
import { ref, type VNode } from 'vue'

type LayoutActions = (() => VNode) | null

export const useLayoutStore = defineStore('layout', () => {
  const isLoading = ref(false)
  const title = ref('My Dashboard')
  const actions = ref<LayoutActions>(null)

  const setLayout = (options: {
    title?: string
    loading?: boolean
    actions?: LayoutActions
  }) => {
    resetLayout()

    if (options.title) title.value = options.title
    if (typeof options.loading === 'boolean') isLoading.value = options.loading
    if (options.actions) actions.value = options.actions
  }

  const resetLayout = () => {
    title.value = 'My Dashboard'
    isLoading.value = false
    actions.value = null
  }

  const setLayoutLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  return {
    actions,
    isLoading,
    resetLayout,
    setLayout,
    setLayoutLoading,
    title,
  }
})
