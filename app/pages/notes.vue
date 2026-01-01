<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <UDashboardPanel :ui="{ body: 'lg:py-12' }">
    <template #header>
      <UDashboardNavbar title="Bloc notes">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="flex flex-col gap-4 w-full lg:max-w-2xl mx-auto">
        <UPageCard
          title="Bloc notes"
          description="Gérer toutes vos tâches."
          variant="naked"
          orientation="horizontal"
        />

        <NotesTabs class="mb-4" />
      </div>
    </template>
  </UDashboardPanel>
</template>
