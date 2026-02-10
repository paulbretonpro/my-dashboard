<script setup lang="ts">
const props = defineProps<{
  summary: SummaryWithLinks
}>()
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
        <ul class="list-disc list-inside text-sm text-muted">
          <li v-for="(link, index) in summary.links" :key="index">
            <NuxtLink
              v-for="(link, index) in summary.links"
              :key="index"
              :to="link"
              class="text-sm text-primary hover:underline break-all"
              target="_blank"
            >
              {{ link }}
            </NuxtLink>
          </li>
        </ul>
      </div>

      <WatchSummaryPopoverAddArticleLink />
    </div>
  </UCard>
</template>
