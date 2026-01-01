<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { user } = useUserSession()
const { isNotificationsSlideoverOpen } = useDashboard()

const items = [
  [
    {
      label: 'Ajouter une tâche',
      icon: 'i-lucide-check-square'
    },
    {
      label: 'Ajouter une page',
      icon: 'i-lucide-file-plus'
    }
  ]
]
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar title="Home" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UTooltip text="Notifications" :shortcuts="['N']">
            <UButton
              color="neutral"
              variant="ghost"
              square
              @click="isNotificationsSlideoverOpen = true"
            >
              <UChip color="error" inset>
                <UIcon name="i-lucide-bell" class="size-5 shrink-0" />
              </UChip>
            </UButton>
          </UTooltip>

          <UDropdownMenu :items="items">
            <UButton icon="i-lucide-plus" size="md" class="rounded-full" />
          </UDropdownMenu>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-col gap-4 sm:gap-6 lg:gap-10 w-full lg:max-w-4xl mx-auto">
        <UPageCard
          :title="`Bonjour, ${user?.displayName}`"
          description="Bienvenue sur votre dashboard. Vous pouvez commencer à organiser votre travail dès maintenant."
          variant="naked"
        >
          <template #title>
            <div class="text-base text-pretty font-semibold text-highlighted">
              Bonjour, <span class="text-primary font-bold">{{ user?.displayName }}</span>
            </div>
          </template>
        </UPageCard>

        <div class="grid grid-cols-2 gap-8">
          <DashboardCardInLate />
          <DashboardCardToday />
        </div>

        <DashboardTable />
      </div>
    </template>
  </UDashboardPanel>
</template>
