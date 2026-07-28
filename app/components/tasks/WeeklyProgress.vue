<script setup lang="ts">
defineProps<{
  total: number
  done: number
  percentage: number
}>()
</script>

<template>
  <div
    class="flex flex-col items-center justify-center p-6 border border-default bg-elevated/40 rounded-2xl text-center space-y-4 w-full"
  >
    <h4 class="text-sm font-bold text-highlighted">Progression Hebdomadaire</h4>

    <div class="relative flex items-center justify-center">
      <!-- SVG Cercle de progression -->
      <svg class="w-32 h-32 transform -rotate-90">
        <circle
          cx="64"
          cy="64"
          r="50"
          stroke="currentColor"
          class="text-default/20"
          stroke-width="8"
          fill="transparent"
        />
        <circle
          cx="64"
          cy="64"
          r="50"
          stroke="currentColor"
          class="text-primary transition-all duration-500 ease-out"
          stroke-width="8"
          fill="transparent"
          :stroke-dasharray="2 * Math.PI * 50"
          :stroke-dashoffset="2 * Math.PI * 50 * (1 - percentage / 100)"
          stroke-linecap="round"
        />
      </svg>
      <div class="absolute flex flex-col items-center justify-center">
        <span class="text-2xl font-black text-highlighted">{{ percentage }}%</span>
        <span class="text-[10px] text-muted uppercase tracking-wider font-bold">Complété</span>
      </div>
    </div>

    <p class="text-xs text-muted">
      <strong>{{ done }}</strong> sur <strong>{{ total }}</strong> sujets terminés cette semaine.
    </p>
  </div>
</template>
