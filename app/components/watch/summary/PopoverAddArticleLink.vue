<script setup lang="ts">
const link = ref('')
</script>

<template>
  <UPopover arrow>
    <UButton color="neutral" variant="soft" icon="i-lucide-plus" class="h-fit my-auto">
      Ajouter un lien
    </UButton>

    <template #content>
      <div class="space-y-4 p-4">
        <UInput v-model="link" placeholder="https://exemple.com/article" class="w-full" />
        <UButton block variant="subtle">Ajouter</UButton>
      </div>
    </template>
  </UPopover>
</template>
