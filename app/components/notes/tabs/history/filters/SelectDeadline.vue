<script setup lang="ts">
const filters = defineModel<string>()

const options = ref([
  { label: 'Sans date limite', value: 'no-deadline' },
  { label: 'En retard', value: 'overdue' },
  { label: "Aujourd'hui", value: 'today' },
  { label: 'Cette semaine', value: 'this-week' },
  { label: 'Ce mois-ci', value: 'this-month' }
])
</script>

<template>
  <USelect :items="options" placeholder="Sélectionner une date limite" class="w-48" />
</template>
