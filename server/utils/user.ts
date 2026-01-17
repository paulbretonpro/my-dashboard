import { H3Event } from 'h3'
import { serverSupabaseUser } from '#supabase/server'

export const requireUserAuth = async (event: H3Event) => {
  // Récupération de l'utilisateur connecté
  const user = await serverSupabaseUser(event)
  if (user === null) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  return user
}
