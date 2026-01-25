// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@formkit/auto-animate/nuxt',
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@nuxt/hints',
    '@nuxtjs/supabase',
    '@nuxt/content'
  ],

  app: {
    keepalive: true
  },

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/api/**': {
      cors: true
    },
    '/': { prerender: true },
    '/login': { prerender: true },
    '/dashboard': { ssr: false }
  },

  compatibilityDate: '2024-07-11',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  imports: {
    dirs: ['server/**', 'shared/**/**', 'composables/**']
  },

  supabase: {
    redirect: true,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/']
    },
  }
})