<script setup lang="ts">
const route = useRoute()
const summaryId = Number(route.params.id)
const summary = ref<Summary>()

const getSummary = async () => {
  summary.value = await $fetch<Summary>(`/api/summary/${summaryId}`)
}

onMounted(getSummary)
</script>

<template>
  <div class="w-full lg:max-w-7xl mx-auto space-y-6">
    <WatchSummaryCardRelatedArticles />
    <UEditor
      ref="editorRef"
      :model-value="summary?.content"
      content-type="html"
      :editable="false"
    />
  </div>
</template>
