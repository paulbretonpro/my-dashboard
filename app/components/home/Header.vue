<template>
  <UHeader>
    <template #left>
      <div class="font-bold text-lg">My dashboard</div>
    </template>

    <template #right>
      <UButton label="S'inscrire" variant="ghost" class="hidden lg:block" />

      <NuxtLink to="/login">
        <UButton label="Se connecter" variant="subtle" class="hidden lg:block" />
      </NuxtLink>
    </template>

    <template #body>
      <UButton label="S'inscrire" variant="ghost" block />

      <NuxtLink to="/login">
        <UButton label="Se connecter" variant="subtle" block />
      </NuxtLink>
    </template>
  </UHeader>
</template>
