<template>
  <ClientOnly>
    <template #placeholder>
      <UEmpty
        icon="i-lucide-file-text"
        title="Chargement..."
        description="Si le chargement est trop long, tu as le temps pour un café "
      />
    </template>
    <div class="lg:max-w-7xl mx-auto w-full space-y-6">
      <WatchSummaryCardRelatedArticles />

      <div
        class="flex justify-center p-4 relative h-svh overflow-y-auto !p-0 rounded-b-md rounded-t-md"
      >
        <WatchSummaryEditor />
      </div>
    </div>
  </ClientOnly>
</template>
