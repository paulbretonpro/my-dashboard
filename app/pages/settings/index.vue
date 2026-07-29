<script setup lang="ts">
const { setLayout } = useLayoutStore()

setLayout({
  title: 'Settings'
})

const { profile, profileSchema, onFileClick, onFileChange, onSubmit } = useUserSettings()

const { state, sections, onChange } = useNotificationsSetting()

const { password, passwordSchema, validate } = useSecuritySettings()

const toast = useToast()
const supabase = useSupabaseClient()
const isDeletingAccount = ref(false)

const onDeleteAccount = async () => {
  const confirmed = confirm("Êtes-vous sûr de vouloir supprimer définitivement votre compte et toutes vos données ? Cette action est irréversible.")
  if (!confirmed) return

  isDeletingAccount.value = true
  try {
    await $fetch('/api/user', { method: 'DELETE' })
    
    // Déconnecter l'utilisateur localement
    await supabase.auth.signOut()
    
    toast.add({
      title: 'Compte supprimé',
      description: 'Votre compte et toutes vos données ont été définitivement supprimés.',
      color: 'success'
    })
    
    // Rediriger vers la page d'accueil ou de connexion
    navigateTo('/login')
  } catch (error: any) {
    toast.add({
      title: 'Erreur',
      description: error.message || 'Impossible de supprimer votre compte.',
      color: 'error'
    })
  } finally {
    isDeletingAccount.value = false
  }
}
</script>

<template>
  <div class="w-full max-w-3xl mx-auto space-y-6">
    <UForm id="settings" :schema="profileSchema" :state="profile" @submit="onSubmit">
      <UPageCard
        title="Profile"
        description="These informations will be displayed publicly."
        variant="naked"
        orientation="horizontal"
        class="mb-4"
      >
        <UButton
          form="settings"
          label="Save changes"
          color="neutral"
          type="submit"
          class="w-fit lg:ms-auto"
        />
      </UPageCard>

      <UPageCard variant="subtle">
        <UFormField
          name="name"
          label="Name"
          description="Will appear on receipts, invoices, and other communication."
          required
          class="flex max-sm:flex-col justify-between items-start gap-4"
        >
          <UInput v-model="profile.name" autocomplete="off" />
        </UFormField>
        <USeparator />
        <UFormField
          name="email"
          label="Email"
          description="Used to sign in, for email receipts and product updates."
          required
          class="flex max-sm:flex-col justify-between items-start gap-4"
        >
          <UInput v-model="profile.email" type="email" autocomplete="off" />
        </UFormField>
        <USeparator />
        <UFormField
          name="avatar"
          label="Avatar"
          description="JPG, GIF or PNG. 1MB Max."
          class="flex max-sm:flex-col justify-between sm:items-center gap-4"
        >
          <div class="flex flex-wrap items-center gap-3">
            <UAvatar :src="profile.avatar" :alt="profile.name" size="lg" />
            <UButton label="Choose" color="neutral" @click="onFileClick" />
            <input
              ref="fileRef"
              type="file"
              class="hidden"
              accept=".jpg, .jpeg, .png, .gif"
              @change="onFileChange"
            />
          </div>
        </UFormField>
      </UPageCard>
    </UForm>

    <div v-for="(section, index) in sections" :key="index">
      <UPageCard
        :title="section.title"
        :description="section.description"
        variant="naked"
        class="mb-4"
      />

      <UPageCard variant="subtle" :ui="{ container: 'divide-y divide-default' }">
        <UFormField
          v-for="field in section.fields"
          :key="field.name"
          :name="field.name"
          :label="field.label"
          :description="field.description"
          class="flex items-center justify-between not-last:pb-4 gap-2"
        >
          <USwitch v-model="state[field.name]" @update:model-value="onChange" />
        </UFormField>
      </UPageCard>
    </div>

    <UPageCard
      title="Password"
      description="Confirm your current password before setting a new one."
      variant="subtle"
    >
      <UForm
        :schema="passwordSchema"
        :state="password"
        :validate="validate"
        class="flex flex-col gap-4 max-w-xs"
      >
        <UFormField name="current">
          <UInput
            v-model="password.current"
            type="password"
            placeholder="Current password"
            class="w-full"
          />
        </UFormField>

        <UFormField name="new">
          <UInput
            v-model="password.new"
            type="password"
            placeholder="New password"
            class="w-full"
          />
        </UFormField>

        <UButton label="Update" class="w-fit" type="submit" />
      </UForm>
    </UPageCard>

    <UPageCard
      title="Account"
      description="No longer want to use our service? You can delete your account here. This action is not reversible. All information related to this account will be deleted permanently."
      class="bg-gradient-to-tl from-error/10 from-5% to-default"
    >
      <template #footer>
        <UButton
          label="Delete account"
          color="error"
          :loading="isDeletingAccount"
          @click="onDeleteAccount"
        />
      </template>
    </UPageCard>
  </div>
</template>
