<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    links?: string[]
  }>(),
  {
    links: () => []
  }
)
</script>

<template>
  <UCard variant="subtle">
    <div class="flex gap-4">
      <UIcon name="i-lucide-file-text" class="text-muted" />
      <div class="flex grow flex-col gap-2">
        <span class="text-sm font-medium">Article(s) lié(s)</span>
        <span class="text-sm text-muted">
          Voici les articles liés à ce résumé. N'hésite pas à les consulter pour approfondir tes
          connaissances sur le sujet.
        </span>
        <NuxtLink
          v-for="(link, index) in props.links"
          :key="index"
          :to="link"
          class="text-sm text-primary hover:underline break-all"
          target="_blank"
        >
          {{ link }}
        </NuxtLink>
      </div>

      <WatchSummaryPopoverAddArticleLink />
    </div>
  </UCard>
</template>
