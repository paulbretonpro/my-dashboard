<script setup lang="ts">
import {
  CalendarDateTime,
  DateFormatter,
  getLocalTimeZone,
  parseDateTime
} from '@internationalized/date'

const modelValue = defineModel<string>()

const df = new DateFormatter('fr-FR', {
  dateStyle: 'short'
})

const proxy = computed<CalendarDateTime | undefined>({
  get: () => {
    return modelValue.value ? parseDateTime(modelValue.value) : undefined
  },
  set: (date: CalendarDateTime | undefined) => {
    console.log(date.toString())

    modelValue.value = date ? date.toString() : undefined
  }
})
</script>

<template>
  <UPopover>
    <UButton
      :variant="proxy ? 'outline' : 'ghost'"
      color="neutral"
      size="xs"
      icon="i-lucide-calendar-days"
      :class="{ 'border border-dashed border-accented text-dimmed': proxy === undefined }"
    >
      {{ proxy ? df.format(proxy.toDate(getLocalTimeZone())) : 'Deadline' }}
    </UButton>

    <template #content>
      <UCalendar v-model="proxy" class="p-2" />
    </template>
  </UPopover>
</template>
