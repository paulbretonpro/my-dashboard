<script setup lang="ts">
import { UButton } from '#components'

const props = defineProps<{
  onDelete: () => void
  onEdit: () => void
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
  <div class="flex items-center gap-4">
    <UButton
      color="neutral"
      icon="i-lucide-arrow-left"
      variant="subtle"
      label="Retour"
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
      icon="i-lucide-edit"
      label="Modifier"
      variant="subtle"
      @click="onEdit"
    />
  </div>
</template>
