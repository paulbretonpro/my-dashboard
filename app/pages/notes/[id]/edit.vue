<script setup lang="ts">
const { getNote, note, loading } = useNote()

onMounted(getNote)
</script>

<template>
  <div class="w-full lg:max-w-7xl mx-auto space-y-6">
    <UEmpty
      v-if="loading"
      icon="i-lucide-notebook"
      title="Chargement..."
      description="Si le chargement est trop long, tu as le temps pour un café "
    />
    <template v-else>
      <NotesForm
        :note
        title="Modifier une note"
        description="Modifie ta note et sauvegarde les changements."
      />
    </template>
  </div>
</template>
