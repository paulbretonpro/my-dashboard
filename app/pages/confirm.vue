<script setup lang="ts">
definePageMeta({
  title: 'Confirming...',
  layout: 'login'
})
const supabase = useSupabaseClient()
const router = useRouter()

watchEffect(async () => {
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (session) {
    router.push('/')
  }
})
</script>

<template>
  <UCard variant="subtle">
    <template #header>
      <div class="flex items-center gap-2 justify-between">
        <div class="space-y-2">
          <div class="text-2xl">Connexion</div>
          <div>Identifiez-vous pour continuer sur le dashboard.</div>
        </div>
        <div
          class="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"
        >
          <UIcon name="i-lucide-log-in" class="h-6 w-6" />
        </div>
      </div>
    </template>

    <div class="py-6 text-center text-sm text-muted-foreground">
      <p>Redirection en cours vers la page de connexion...</p>
      <p>Si la redirection ne fonctionne pas</p>
      <NuxtLink class="text-primary hover:underline" to="/login">veuillez cliquer ici</NuxtLink>
    </div>
  </UCard>
</template>
