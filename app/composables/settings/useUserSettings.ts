import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

export default function () {
  const user = useSupabaseUser()

  const fileRef = ref<HTMLInputElement>()

  const profileSchema = z.object({
    name: z.string().min(2, 'Too short'),
    email: z.string().email('Invalid email'),
    username: z.string().min(2, 'Too short'),
    avatar: z.string().optional(),
    bio: z.string().optional()
  })

  type ProfileSchema = z.output<typeof profileSchema>

  const profile = computed(() => ({
    name: user.value?.displayName || 'Utilisateur',
    email: '',
    username: user.value?.displayName || '',
    avatar: user.value?.avatarUrl,
    bio: undefined
  }))
  const toast = useToast()
  async function onSubmit(event: FormSubmitEvent<ProfileSchema>) {
    toast.add({
      title: 'Success',
      description: 'Your settings have been updated.',
      icon: 'i-lucide-check',
      color: 'success'
    })
  }

  function onFileChange(e: Event) {
    const input = e.target as HTMLInputElement

    if (!input.files?.length) {
      return
    }

    profile.value.avatar = URL.createObjectURL(input.files[0]!)
  }

  function onFileClick() {
    fileRef.value?.click()
  }

  return {
    profile,
    profileSchema,
    fileRef,
    onFileChange,
    onFileClick,
    onSubmit
  }
}