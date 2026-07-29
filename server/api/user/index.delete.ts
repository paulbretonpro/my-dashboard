import { eq } from 'drizzle-orm'
import { db } from '~~/server/db'
import { users } from '~~/server/db/schema'
import { requireUserAuth } from '~~/server/utils/user'
import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const authUser = await requireUserAuth(event)
  const userId = authUser.sub

  // 1. Initialiser le client Supabase avec le rôle de service pour pouvoir supprimer l'utilisateur de Supabase Auth
  try {
    const supabaseAdmin = serverSupabaseServiceRole(event)
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)
    if (authError) {
      console.error('Failed to delete user from Supabase Auth:', authError)
    }
  } catch (err) {
    console.error('Failed to initialize Supabase admin client:', err)
  }

  // 2. Supprimer l'utilisateur de la base de données (cascade automatique sur toutes ses données locales)
  const result = await db
    .delete(users)
    .where(eq(users.id, userId))
    .returning()

  return {
    success: true,
    message: 'Compte supprimé avec succès',
    data: result
  }
})
