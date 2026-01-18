<template>
  <UDashboardPanel :ui="{ body: 'lg:py-12' }">
    <template #header>
      <UDashboardNavbar title="Veille technologique">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-col gap-6 w-full lg:max-w-2xl mx-auto">
        <UPageCard
          title="Sources RSS"
          description="Gérer les sources RSS."
          variant="naked"
          orientation="horizontal"
        >
          <template #default>
            <UButton icon="i-lucide-plus" class="w-fit ml-auto">Ajouter</UButton>
          </template>
        </UPageCard>

        <WatchSources />
      </div>
    </template>
  </UDashboardPanel>
</template>
