<script setup lang="ts">
const { setLayout } = useLayoutStore()

setLayout({
  title: 'Dashboard'
})

const user = useSupabaseUser()

const { data: dashboard } = useLazyFetch('/api/dashboard', {
  key: 'dashboard',
  headers: useRequestHeaders(['cookie'])
})

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
    >
      <template #title>
        <div class="text-2xl text-pretty font-bold text-highlighted">
          Bonjour, <span class="text-primary font-bold">{{ user?.displayName }}</span>
        </div>
      </template>
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

    <DashboardTable />
  </div>
</template>
