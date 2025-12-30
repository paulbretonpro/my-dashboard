import { eq } from 'drizzle-orm'
import { db } from '../db'
import { users } from '../db/schema'

export async function createUserIfNotExists(event, session) {
  let existingUser = await db
    .select()
    .from(users)
    .where(eq(users.providerId, String(session.user.id)))

  if (!existingUser[0]) {
    existingUser = await db
      .insert(users)
      .values({
        displayName: session.user.name,
        avatarUrl: session.user.avatar_url,
        providerId: String(session.user.id)
      })
      .returning()
  }

  return existingUser[0]
}
