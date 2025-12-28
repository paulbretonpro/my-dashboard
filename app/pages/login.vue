<script setup lang="ts">
definePageMeta({
  title: 'Login',
  layout: false
})

// États pour le formulaire
const email = ref('')
const password = ref('')
const error = ref<string | null>(null)
const isLoading = ref(false)

// Router et route
const router = useRouter()
const route = useRoute()
const redirectTo = computed(() => {
  const param = route.query.redirectTo as string
  return param && param.startsWith('/') ? param : '/'
})
</script>

<template>
  <div
    class="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background"
  >
    <!-- Background blobs -->
    <div class="pointer-events-none absolute inset-0">
      <div class="absolute left-0 top-10 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
      <div class="absolute bottom-10 right-[-3rem] h-80 w-80 rounded-full bg-accent/30 blur-3xl" />
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_30%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.05),transparent_30%)]"
      />
    </div>

    <div
      class="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-10 px-6 py-12 lg:flex-row lg:items-center"
    >
      <!-- Texte à gauche -->
      <div class="max-w-2xl space-y-4 lg:flex-1">
        <div
          class="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
        >
          <UIcon name="i-lucide-shield-check" class="h-4 w-4" />
          Sécurité Supabase activée
        </div>
        <h1 class="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Accédez à votre espace
        </h1>
        <p class="text-muted-foreground text-lg">
          Connectez-vous pour retrouver vos tableaux, vos tâches et vos rappels. La session est
          gérée par Supabase pour sécuriser vos données.
        </p>
        <div class="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
          <UCard>
            <p class="font-medium text-foreground">Authentification sécurisée</p>
            <p>Vos informations de connexion sont protégées par Supabase Auth.</p>
          </UCard>

          <UCard>
            <p class="font-medium text-foreground">Connexion chiffrée</p>
            <p>Toutes les communications avec le serveur sont sécurisées via HTTPS.</p>
          </UCard>
        </div>
      </div>

      <!-- Card login -->
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

        <form class="space-y-4">
          <!-- Email -->
          <div class="space-y-2">
            <UInput
              id="email"
              type="email"
              placeholder="vous@example.com"
              v-model="email"
              required
              icon="i-lucide-mail"
              size="lg"
              class="w-full"
            />
          </div>

          <!-- Password -->
          <div class="space-y-2">
            <UInput
              id="password"
              type="password"
              placeholder="••••••••"
              v-model="password"
              required
              icon="i-lucide-lock"
              size="lg"
              class="w-full"
            />
          </div>

          <!-- Error -->
          <div v-if="error" class="rounded-lg border p-2 text-sm text-error font-medium">
            {{ error }}
          </div>

          <UButton type="submit" block class="w-full" :disabled="isLoading">
            <template v-if="isLoading">
              <div class="flex items-center justify-center gap-2">
                <USpinner />
                Connexion...
              </div>
            </template>
            <template v-else> Se connecter </template>
          </UButton>

          <UButton
            to="/api/auth/github"
            icon="i-simple-icons-github"
            label="Login with GitHub"
            color="neutral"
            size="xs"
            external
          />
        </form>

        <template #footer>
          <div class="text-sm text-muted-foreground">
            <div class="text-xs">
              Besoin d'un compte ?
              <NuxtLink
                :to="`/signup${route.query.redirectTo ? `?redirectTo=${encodeURIComponent(route.query.redirectTo as string)}` : ''}`"
                class="text-primary hover:underline"
              >
                Créer un compte
              </NuxtLink>
              .
            </div>
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>
