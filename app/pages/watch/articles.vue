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
          title="Liste des articles"
          description="Tous les articles issus de vos sources RSS."
          variant="naked"
          orientation="horizontal"
        />

        <WatchArticles />
      </div>
    </template>
  </UDashboardPanel>
</template>
