<script setup lang="ts">
const emit = defineEmits(['new-task-added'])

const defaultNewTask: NewTask = {
  content: '',
  deadline: undefined,
  recall: undefined
}

const newTask = ref<NewTask>({ ...defaultNewTask })
const loading = ref(false)

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
      </div>

      <UChatPromptSubmit
        icon="i-lucide-plus"
        :disabled="newTask.content.trim().length === 0"
        :loading
      />
    </template>
  </UChatPrompt>
</template>
