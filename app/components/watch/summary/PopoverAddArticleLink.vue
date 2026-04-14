<script setup lang="ts">
const props = defineProps<{
  summary: Summary
}>()

const emit = defineEmits(['link-added'])

const open = ref(false)
const link = ref('')

const handleAddLink = async () => {
  try {
    await $fetch(`/api/summary/${props.summary.id}/add-url`, {
      method: 'POST',
      body: {
        url: link.value
      }
    })

    open.value = false
    link.value = ''
    emit('link-added')
  } catch {
    useToast().add({
      title: 'Erreur',
      description: "Une erreur est survenue lors de l'ajout du lien.",
      color: 'error'
    })
  }
}
</script>

<template>
  <UPopover v-model:open="open" arrow>
    <UButton color="neutral" variant="soft" icon="i-lucide-plus" class="h-fit my-auto">
      Ajouter un lien
    </UButton>

    <template #content>
      <div class="space-y-4 p-4">
        <UInput v-model="link" placeholder="https://exemple.com/article" class="w-full" />
        <UButton block variant="subtle" @click="handleAddLink">Ajouter</UButton>
      </div>
    </template>
  </UPopover>
</template>
