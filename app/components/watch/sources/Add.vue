<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const toast = useToast()
const formRef = useTemplateRef('formRef')

const schema = z.object({
  link: z.string().optional(),
  name: z.string(),
  publishedAt: z.string().optional(),
  siteUrl: z.url('Invalid URL'),
  summary: z.string().optional(),
  title: z.string().optional(),
  url: z.url('Invalid URL')
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  publishedAt: undefined,
  summary: undefined,
  title: undefined,
  link: undefined,
  name: undefined,
  url: undefined,
  siteUrl: undefined
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // TODO: implement API call
}
</script>

<template>
  <UModal title="Ajouter une source RSS">
    <UButton icon="i-lucide-plus" class="w-fit ml-auto"> Ajouter </UButton>

    <template #body>
      <UForm ref="formRef" :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="Nom" name="name">
          <UInput v-model="state.name" class="w-full" />
        </UFormField>

        <UFormField label="Url" name="url">
          <UInput v-model="state.url" class="w-full" />
        </UFormField>

        <div>Mapping (optional)</div>
        <div class="mx-6 space-y-2">
          <UFormField name="title">
            <div class="grid grid-cols-3 gap-4">
              <div class="self-center">Title</div>
              <UIcon name="i-lucide-move-right" class="self-center justify-self-center" />
              <UInput v-model="state.title" class="w-full" />
            </div>
          </UFormField>
          <UFormField name="summary">
            <div class="grid grid-cols-3 gap-4">
              <div class="self-center">Summary</div>
              <UIcon name="i-lucide-move-right" class="self-center justify-self-center" />
              <UInput v-model="state.summary" class="w-full" />
            </div>
          </UFormField>
          <UFormField name="link">
            <div class="grid grid-cols-3 gap-4">
              <div class="self-center">Link</div>
              <UIcon name="i-lucide-move-right" class="self-center justify-self-center" />
              <UInput v-model="state.link" class="w-full" />
            </div>
          </UFormField>
          <UFormField name="publishedAt">
            <div class="grid grid-cols-3 gap-4">
              <div class="self-center">Published At</div>
              <UIcon name="i-lucide-move-right" class="self-center justify-self-center" />
              <UInput v-model="state.publishedAt" class="w-full" />
            </div>
          </UFormField>
        </div>
      </UForm>
    </template>

    <template #footer>
      <div class="ml-auto space-x-4">
        <UButton variant="outline"> Annuler </UButton>
        <UButton @click="() => formRef?.submit()"> Ajouter </UButton>
      </div>
    </template>
  </UModal>
</template>
