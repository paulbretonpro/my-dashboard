<script setup lang="ts">
const colorMode = useColorMode()

// Restore primary and neutral colors from cookies on load
const appConfig = useAppConfig()
const primaryColorCookie = useCookie<string>('theme-primary')
const neutralColorCookie = useCookie<string>('theme-neutral')

if (primaryColorCookie.value) {
  appConfig.ui.colors.primary = primaryColorCookie.value
}
if (neutralColorCookie.value) {
  appConfig.ui.colors.neutral = neutralColorCookie.value
}

const color = computed(() => (colorMode.value === 'dark' ? '#1b1718' : 'white'))

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: {
    lang: 'fr'
  }
})

const title = 'My dashboard'
const description = ''

const statusCode = (error: Error) => error?.statusCode ?? 500
const statusMessage = (error: Error) => {
  if (statusCode(error) === 404) {
    return "Cette page n'existe pas"
  }
  return 'Erreur'
}
const message = "Une erreur s'est produite au chargement de cette page."

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/dashboard-light.png',
  twitterImage: 'https://ui.nuxt.com/assets/templates/nuxt/dashboard-light.png',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtErrorBoundary>
        <NuxtPage />

        <template #error="{ error }">
          <div class="w-full">
            <UError
              :error="{
                statusCode: statusCode(error),
                statusMessage: statusMessage(error),
                message
              }"
              :clear="{
                label: 'Retour à la page d\'accueil',
                icon: 'i-lucide-arrow-left'
              }"
            />
          </div>
        </template>
      </NuxtErrorBoundary>
    </NuxtLayout>
  </UApp>
</template>
