<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <div>
    {{ $route.params.id }}
  </div>
</template>
