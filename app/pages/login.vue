<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

definePageMeta({
  title: 'Login',
  layout: 'login'
})

const supabase = useSupabaseClient()
const toast = useToast()

const loading = ref(false)

const fields: AuthFormField[] = [
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    required: true
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
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
  email: z.email('Invalid email'),
  password: z.string('Password is required').min(8, 'Must be at least 8 characters')
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

    <UAuthForm
      :schema
      :fields
      :providers
      :submit="{
        loading,
        icon: 'i-lucide-log-in'
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
