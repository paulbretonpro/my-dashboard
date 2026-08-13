// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@formkit/auto-animate/nuxt',
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@nuxt/hints',
    '@nuxtjs/supabase',
    '@nuxt/content',
    '@pinia/nuxt',
    '@nuxtjs/device'
  ],

  experimental: {
    ssrStreaming: true
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

  runtimeConfig: {
    public: {
      aiGatewayApiKey: process.env.NUXT_AI_GATEWAY_API_KEY || ''
    }
  },

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
    }
  },

  vite: {
    optimizeDeps: {
      include: [
        '@nuxt/ui > prosemirror-state',
        '@nuxt/ui > prosemirror-transform',
        '@nuxt/ui > prosemirror-model',
        '@nuxt/ui > prosemirror-view',
        '@nuxt/ui > prosemirror-gapcursor'
      ]
    }
  }
})
