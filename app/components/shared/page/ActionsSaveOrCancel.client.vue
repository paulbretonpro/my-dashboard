<script setup lang="ts">
defineProps<{
  onSave: () => void
}>()

const router = useRouter()

const handleBack = () => {
  router.back()
}
</script>

<template>
  <div class="flex items-center gap-2">
    <UButton
      color="neutral"
      icon="i-lucide-x"
      variant="ghost"
      label="Annuler"
      @click="handleBack"
    />
    <UButton
      color="primary"
      icon="i-lucide-save"
      label="Enregistrer"
      variant="subtle"
      @click="onSave"
    />
  </div>
</template>
