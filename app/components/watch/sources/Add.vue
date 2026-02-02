<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const open = ref(false)

const toast = useToast()
const formRef = useTemplateRef('formRef')

const loading = ref(false)

const schema = z.object({
  name: z.string(),
  url: z.url('Invalid URL')
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  name: undefined,
  url: undefined
})

const resetForm = () => {
  state.name = undefined
  state.url = undefined
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true
  try {
    await $fetch('/api/rss', {
      method: 'POST',
      body: event.data
    })
    toast.add({ title: 'Source RSS ajoutée avec succès', color: 'success' })
    open.value = false
    // Reset form state
    resetForm()
  } catch (error) {
    toast.add({ title: "Erreur lors de l'ajout de la source RSS", color: 'error' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UModal title="Ajouter une source RSS" v-model:open="open">
    <UButton icon="i-lucide-plus" class="w-fit ml-auto" @click="open = true"> Ajouter </UButton>

    <template #body>
      <UForm ref="formRef" :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="Nom" name="name">
          <UInput v-model="state.name" class="w-full" />
        </UFormField>

        <UFormField label="Url" name="url">
          <UInput v-model="state.url" class="w-full" />
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <div class="ml-auto space-x-4">
        <UButton variant="outline"> Annuler </UButton>
        <UButton :loading @click="() => formRef?.submit()"> Ajouter </UButton>
      </div>
    </template>
  </UModal>
</template>
