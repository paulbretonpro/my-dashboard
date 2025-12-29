import { db, schema } from 'hub:db'
import { eq } from 'drizzle-orm'

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const workspaces = await db
    .select()
    .from(schema.workspaces)
    .where(eq(schema.workspaces.userId, user.id))

  return workspaces
})
