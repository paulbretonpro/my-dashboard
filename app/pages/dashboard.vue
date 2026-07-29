<script setup lang="ts">
const { setLayout } = useLayoutStore()

setLayout({
  title: 'Dashboard'
})

const user = useSupabaseUser()

const isCreating = ref(false)
const formRef = ref<any>(null)
const dashboardTableRef = ref<any>(null)

const { data: dashboard, refresh: refreshDashboard } = useLazyFetch('/api/dashboard', {
  key: 'dashboard',
  headers: useRequestHeaders(['cookie'])
})

const onSave = () => {
  isCreating.value = false
  refreshDashboard()
  dashboardTableRef.value?.refresh()
}

const staticsInLateTasks = computed(() => ({
  title: 'En retard',
  description: 'Les sujets en retard',
  count: dashboard.value?.inLateTasks ?? 0
}))

const staticsTodayTasks = computed(() => ({
  title: 'Aujourd’hui',
  description: 'Les sujets prévus pour aujourd’hui',
  count: dashboard.value?.todayTasks ?? 0
}))

const newArticles = computed(() => dashboard.value?.newArticles ?? 0)
</script>

<template>
  <div class="flex flex-col gap-6 w-full lg:max-w-4xl mx-auto">
    <UPageCard
      :title="`Bonjour, ${user?.displayName}`"
      description="Bienvenue sur votre dashboard. Vous pouvez commencer à organiser votre travail dès maintenant."
      variant="naked"
      orientation="horizontal"
    >
      <template #title>
        <div class="text-2xl text-pretty font-bold text-highlighted">
          Bonjour, <span class="text-primary font-bold">{{ user?.displayName }}</span>
        </div>
      </template>

      <div class="flex items-center gap-2 sm:ml-auto">
        <UButton
          label="Nouveau sujet"
          icon="i-lucide-plus"
          size="md"
          @click="isCreating = true"
        />
      </div>
    </UPageCard>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <DashboardCardStatistic
        :description="staticsInLateTasks.description"
        :title="staticsInLateTasks.title"
        :count="staticsInLateTasks.count"
      />
      <DashboardCardStatistic
        :description="staticsTodayTasks.description"
        :title="staticsTodayTasks.title"
        :count="staticsTodayTasks.count"
      />
      <DashboardCardNewArticles :count="newArticles" />
    </div>

    <DashboardTable ref="dashboardTableRef" />

    <!-- Tiroir latéral droit pour la création d'un sujet -->
    <USlideover
      v-model:open="isCreating"
      title="Nouveau sujet"
      description="Remplissez les détails ci-dessous pour créer un nouveau sujet."
    >
      <template #body>
        <div class="p-1 h-full overflow-y-auto">
          <TasksForm
            ref="formRef"
            hide-footer-buttons
            @save="onSave"
            @cancel="isCreating = false"
          />
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <UButton label="Annuler" color="neutral" variant="ghost" @click="isCreating = false" />
          <UButton label="Enregistrer" color="primary" @click="() => formRef?.onSave()" />
        </div>
      </template>
    </USlideover>
  </div>
</template>
