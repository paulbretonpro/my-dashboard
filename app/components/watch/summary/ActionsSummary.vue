<script setup lang="ts">
defineProps<{
  onDelete: () => void
  onEdit: () => void
}>()
</script>

<template>
  <div class="flex items-center gap-2">
    <UButton
      color="error"
      variant="ghost"
      label="Supprimer"
      icon="i-lucide-trash"
      @click="onDelete"
    />
    <UButton
      color="primary"
      variant="ghost"
      label="Modifier"
      icon="i-lucide-edit"
      @click="onEdit"
    />
  </div>
</template>
