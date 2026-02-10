<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

definePageMeta({
  title: 'Login',
  layout: 'login'
})

const supabase = useSupabaseClient()
const toast = useToast()
const { isDesktop } = useDevice()

const loading = ref(false)

const fields: AuthFormField[] = [
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    required: true
  },
  {
    name: 'password',
    label: 'Mot de passe',
    type: 'password',
    required: true
  }
]

const providers = [
  {
    label: 'GitHub',
    icon: 'i-simple-icons-github',
    onClick: async () => {
      await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/confirm`
        }
      })
    }
  }
]

const schema = z.object({
  email: z.email('Email invalide'),
  password: z.string('Mot de passe est requis').min(8, 'Doit contenir au moins 8 caractères')
})

type Schema = z.output<typeof schema>

const onSubmit = async (payload: FormSubmitEvent<Schema>) => {
  loading.value = true

  const { data, error } = await supabase.auth.signInWithPassword({
    email: payload.data.email,
    password: payload.data.password
  })

  if (error) {
    toast.add({ title: 'Error', description: error.message, color: 'error' })
  } else {
    navigateTo('/dashboard')
  }

  loading.value = false
}
</script>

<template>
  <!-- Card login -->
  <UCard variant="subtle" class="md:mx-auto">
    <template #header v-if="isDesktop">
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

    <UAuthForm
      :schema
      :fields
      :providers
      :submit="{
        loading,
        trailingIcon: 'i-lucide-arrow-right',
        ui: {
          trailingIcon: 'ml-0 size-4'
        }
      }"
      @submit="onSubmit"
    />

    <template #footer>
      <div class="text-sm text-muted-foreground">
        <div class="text-xs">
          Besoin d'un compte ?
          <NuxtLink class="text-primary hover:underline"> Créer un compte </NuxtLink>
          .
        </div>
      </div>
    </template>
  </UCard>
</template>
