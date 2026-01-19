<script setup lang="ts">
const sourcesRef = ref()

const handleRefresh = () => {
  sourcesRef.value?.refresh()
}
</script>

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
            <WatchSubscribe @close="handleRefresh" />
          </template>
        </UPageCard>

        <WatchSources ref="sourcesRef" />
      </div>
    </template>
  </UDashboardPanel>
</template>
