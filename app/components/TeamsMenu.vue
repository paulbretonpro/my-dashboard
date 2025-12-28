<script setup lang="ts">
defineProps<{
  collapsed?: boolean
}>()

const teams = ref([
  {
    label: 'Personal',
    avatar: {
      src: 'https://github.com/nuxt.png',
      alt: 'Personal'
    }
  },
  {
    label: 'Team',
    avatar: {
      src: 'https://github.com/nuxt-hub.png',
      alt: 'Team'
    }
  }
])

const selectedTeam = ref(teams.value[0])
</script>

<template>
  <UDropdownMenu
    :items="teams"
    :content="{ align: 'center', collisionPadding: 12 }"
    :ui="{ content: collapsed ? 'w-40' : 'w-(--reka-dropdown-menu-trigger-width)' }"
  >
    <UButton
      v-bind="{
        ...selectedTeam,
        label: collapsed ? undefined : selectedTeam?.label,
        trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down'
      }"
      color="neutral"
      variant="ghost"
      block
      :square="collapsed"
      class="data-[state=open]:bg-elevated"
      :class="[!collapsed && 'py-2']"
      :ui="{
        trailingIcon: 'text-dimmed'
      }"
    />
  </UDropdownMenu>
</template>
