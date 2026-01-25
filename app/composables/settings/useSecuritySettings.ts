import * as z from 'zod'
import type { FormError } from '@nuxt/ui'

export default function () {
  const passwordSchema = z.object({
    current: z.string().min(8, 'Must be at least 8 characters'),
    new: z.string().min(8, 'Must be at least 8 characters')
  })

  type PasswordSchema = z.output<typeof passwordSchema>

  const password = reactive<Partial<PasswordSchema>>({
    current: undefined,
    new: undefined
  })

  const validate = (state: Partial<PasswordSchema>): FormError[] => {
    const errors: FormError[] = []
    if (state.current && state.new && state.current === state.new) {
      errors.push({ name: 'new', message: 'Passwords must be different' })
    }
    return errors
  }

  return {
    passwordSchema,
    password,
    validate
  }
}