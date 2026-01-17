import { db } from '~~/server/db'
import { users } from '~~/server/db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const authUser = await requireUserAuth(event)

  const [user] = await db.select().from(users).where(eq(users.id, authUser.sub))

  return user
})
