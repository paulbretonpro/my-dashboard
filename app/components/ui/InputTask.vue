<script setup lang="ts">
import type { SelectItem } from '@nuxt/ui'
import { AppFetchKeysEnum } from '~~/shared/types'

const newTask = ref({
  content: undefined,
  deadline: undefined,
  recall: undefined,
  pageId: undefined
})

const { data } = useNuxtData<PageWithChildren[]>(AppFetchKeysEnum.PAGES)

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
</script>

<template>
  <UChatPrompt
    v-model="newTask.content"
    :rows="2"
    placeholder="Ajouter votre tâche..."
    class="shadow-lg"
  >
    <UChatPromptSubmit icon="i-lucide-send" color="neutral" />

    <template #footer>
      <div class="flex gap-2">
        <UButton
          variant="ghost"
          color="neutral"
          size="xs"
          icon="i-lucide-calendar-days"
          :ui="{ base: 'border border-dashed border-accented' }"
        >
          Deadline
        </UButton>
        <UButton
          variant="ghost"
          color="neutral"
          size="xs"
          icon="i-lucide-bell-ring"
          :ui="{ base: 'border border-dashed border-accented' }"
        >
          Recall
        </UButton>
        <USelect
          v-if="pages.length"
          v-model="newTask.pageId"
          placeholder="Page"
          size="xs"
          :ui="{ base: 'border border-dashed border-accented' }"
          variant="ghost"
          :items="pages"
          class="w-32"
          value-key="id"
        ></USelect>
      </div>
    </template>
  </UChatPrompt>
</template>
