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
      <div class="flex flex-col gap-4 sm:gap-6 lg:gap-10 w-full lg:max-w-2xl mx-auto">
        <UPageCard
          title="Page du jour"
          description="Gérer toutes les tâches créées aujourd'hui."
          variant="naked"
          orientation="horizontal"
          class="mb-4"
        />

        <UiInputTask />

        <UiTask
          :task="{
            id: 1,
            content: 'Exemple de tâche 1',
            isDone: false,
            deadline: new Date(),
            recall: new Date(),
            userId: 1,
            pageId: 1
          }"
        />
      </div>
    </template>
  </UDashboardPanel>
</template>
