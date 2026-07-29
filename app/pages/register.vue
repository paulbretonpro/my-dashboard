<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

definePageMeta({
  title: 'Register',
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

  const { data, error } = await supabase.auth.signUp({
    email: payload.data.email,
    password: payload.data.password,
    options: {
      emailRedirectTo: `${window.location.origin}/confirm`
    }
  })

  if (error) {
    toast.add({ title: 'Erreur', description: error.message, color: 'error' })
  } else {
    toast.add({
      title: 'Inscription réussie',
      description: 'Veuillez vérifier votre boîte de réception pour confirmer votre compte.',
      color: 'success'
    })
    navigateTo('/login')
  }

  loading.value = false
}
</script>

<template>
  <!-- Card Register -->
  <UCard variant="subtle" class="md:mx-auto">
    <template #header v-if="isDesktop">
      <div class="flex items-center gap-2 justify-between">
        <div class="space-y-2">
          <div class="text-2xl">Inscription</div>
          <div>Créez un compte pour commencer à utiliser le dashboard.</div>
        </div>
        <div
          class="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"
        >
          <UIcon name="i-lucide-user-plus" class="h-6 w-6" />
        </div>
      </div>
    </template>

    <UAuthForm
      :schema
      :fields
      :providers
      :submit="{
        label: 'S\'inscrire',
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
          Vous avez déjà un compte ?
          <NuxtLink class="text-primary hover:underline" to="/login"> Se connecter </NuxtLink>
          .
        </div>
      </div>
    </template>
  </UCard>
</template>
