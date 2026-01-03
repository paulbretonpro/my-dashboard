<script setup lang="ts">
const filters = defineModel<string>()

const statusOptions = [
  { label: 'Tous', value: 'all' },
  { label: 'Terminer', value: 'true' },
  { label: 'À faire', value: 'false' }
]
</script>

<template>
  <USelect v-model="filters" placeholder="Status" :items="statusOptions" class="w-32" />
</template>
