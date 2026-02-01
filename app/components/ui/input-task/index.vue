<script setup lang="ts">
import type { SelectItem } from '@nuxt/ui'
import { AppFetchKeysEnum } from '~~/shared/types'

const emit = defineEmits(['new-task-added'])

const defaultNewTask: NewTask = {
  content: '',
  deadline: undefined,
  recall: undefined,
  pageId: undefined
}

const newTask = ref<NewTask>({ ...defaultNewTask })
const loading = ref(false)

const { data, status } = await useLazyFetch<PageWithChildren[]>('/api/pages', {
  key: AppFetchKeysEnum.PAGES,
  server: false,
  default: () => []
})

const pages = computed<SelectItem[]>(() => {
  return data.value
    ?.map((page: PageWithChildren) => {
      if (page?.children && page.children.length > 0) {
        return [
          { type: 'label', label: page.name },
          ...page.children.map((child: Page) => ({
            type: 'item',
            label: child.name,
            id: child.id
          })),
          { type: 'separator' }
        ]
      } else {
        return {
          type: 'item',
          label: page.name,
          id: page.id
        }
      }
    })
    .flat()
})

const handleSubmit = async () => {
  loading.value = true
  try {
    await $fetch('/api/tasks', {
      method: 'POST',
      body: newTask.value
    })

    emit('new-task-added')

    newTask.value = { ...defaultNewTask }
  } catch (error) {
    console.error('Erreur lors de la création de la tâche :', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UChatPrompt
    v-model="newTask.content"
    :rows="2"
    placeholder="Ajouter votre tâche..."
    class="shadow-lg ring-2"
    @submit="handleSubmit"
  >
    <template #footer>
      <div class="flex gap-2">
        <UiInputTaskDatepicker v-model="newTask.deadline" />
        <UButton
          variant="ghost"
          color="neutral"
          size="xs"
          icon="i-lucide-bell-ring"
          :ui="{ base: 'border border-dashed border-accented text-dimmed' }"
        >
          Recall
        </UButton>
        <USelect
          v-if="pages.length"
          v-model="newTask.pageId"
          :items="pages"
          :class="{ 'border border-dashed border-accented': newTask.pageId === undefined }"
          placeholder="Page"
          size="xs"
          value-key="id"
          :variant="newTask.pageId === undefined ? 'ghost' : 'outline'"
          class="w-32"
        />
      </div>

      <UChatPromptSubmit
        icon="i-lucide-plus"
        :disabled="newTask.content.trim().length === 0"
        :loading
      />
    </template>
  </UChatPrompt>
</template>
