<script setup lang="ts">
const { setLayout } = useLayoutStore()

setLayout({
  title: 'Roadmap'
})

const isCreating = ref(false)
const tasksListRef = ref<any>(null)
const formRef = ref<any>(null)

const onSave = () => {
  isCreating.value = false
  tasksListRef.value?.refresh()
}
</script>

<template>
  <div class="flex flex-col gap-6 w-full lg:max-w-7xl mx-auto px-6 py-6">
    <div class="flex justify-between items-center gap-4">
      <div class="flex flex-col gap-1">
        <h1 class="text-2xl font-bold text-highlighted">Roadmap de sujets</h1>
        <p class="text-sm text-muted">
          Visualisez et gérez l'état d'avancement de vos sujets à traiter sous forme de Kanban.
        </p>
      </div>
      <UButton
        label="Nouveau sujet"
        icon="i-lucide-plus"
        size="lg"
        class="hidden md:inline-flex"
        @click="isCreating = true"
      />
    </div>

    <!-- Bouton flottant (FAB) en bas à droite pour mobile uniquement -->
    <UButton
      icon="i-lucide-plus"
      size="xl"
      color="primary"
      class="fixed bottom-6 right-6 z-50 rounded-full shadow-2xl md:hidden h-14 w-14 flex items-center justify-center p-0"
      @click="isCreating = true"
    />

    <!-- Tiroir latéral droit pour la création d'un sujet -->
    <USlideover
      v-model:open="isCreating"
      title="Nouveau sujet"
      description="Remplissez les détails ci-dessous pour créer un nouveau sujet."
    >
      <template #body>
        <div class="p-1 h-full overflow-y-auto">
          <TasksForm ref="formRef" hide-footer-buttons @save="onSave" @cancel="isCreating = false" />
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <UButton label="Annuler" color="neutral" variant="ghost" @click="isCreating = false" />
          <UButton label="Enregistrer" color="primary" @click="() => formRef?.onSave()" />
        </div>
      </template>
    </USlideover>

    <TasksList ref="tasksListRef" />
  </div>
</template>
