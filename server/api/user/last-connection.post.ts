import { eq } from 'drizzle-orm'
import { db } from '~~/server/db'
import { users } from '~~/server/db/schema'
import { requireUserAuth } from '~~/server/utils/user'

export default defineEventHandler(async (event) => {
  const user = await requireUserAuth(event)

  // Récupérer la date de dernière connexion actuelle
  const [currentUser] = await db.select().from(users).where(eq(users.id, user.sub))

  // Si currentUser.lastConnection est égal à aujourd'hui, ne rien faire
  const now = new Date()
  if (currentUser?.lastConnection) {
    const lastConnectionDate = new Date(currentUser.lastConnection)
    if (
      lastConnectionDate.getFullYear() === now.getFullYear() &&
      lastConnectionDate.getMonth() === now.getMonth() &&
      lastConnectionDate.getDate() === now.getDate()
    ) {
      return { success: true, message: 'Last connection already updated today' }
    }
  }

  // Mettre à jour : previousConnection = lastConnection, lastConnection = maintenant
  await db
    .update(users)
      .set({ 
        previousConnection: currentUser?.lastConnection || null,
        lastConnection: new Date() 
      })
    .where(eq(users.id, user.sub))

  return { success: true, message: 'Last connection updated' }
})
