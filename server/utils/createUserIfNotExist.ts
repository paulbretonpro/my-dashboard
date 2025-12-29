import { eq } from 'drizzle-orm'

export async function createUserIfNotExists(event, session) {
  let existingUser = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.providerId, String(session.user.id)))

  if (!existingUser[0]) {
    existingUser = await db
      .insert(schema.users)
      .values({
        displayName: session.user.name,
        avatarUrl: session.user.avatar_url,
        providerId: String(session.user.id)
      })
      .returning()
  }

  return existingUser[0]
}
