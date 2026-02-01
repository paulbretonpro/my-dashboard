import { eq } from 'drizzle-orm'
import { db } from '~~/server/db'
import { users } from '~~/server/db/schema'
import { requireUserAuth } from '~~/server/utils/user'

export default defineEventHandler(async (event) => {
  const user = await requireUserAuth(event)

  // Mettre à jour la date de dernière connexion
  await db
    .update(users)
    .set({ lastConnection: new Date() })
    .where(eq(users.id, user.sub))

  return { success: true }
})
