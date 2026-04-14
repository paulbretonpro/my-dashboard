<script setup lang="ts">
import { UButton } from '#components'

const props = defineProps<{
  onDelete: () => void
  onSave: () => void
  onBack: () => void
}>()

const router = useRouter()

const handleBack = () => {
  if (props.onBack) {
    props.onBack()
    return
  }

  router.back()
}
</script>

<template>
  <div class="flex items-center gap-2">
    <UButton
      color="neutral"
      icon="i-lucide-x"
      variant="subtle"
      label="Annuler"
      @click="handleBack"
    />
    <UButton
      color="error"
      icon="i-lucide-trash"
      label="Supprimer"
      variant="subtle"
      @click="onDelete"
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
