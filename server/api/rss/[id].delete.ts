import { and, eq } from "drizzle-orm"
import { db } from "~~/server/db"
import { userSources } from "~~/server/db/schema"

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const user = await requireUserAuth(event)

  // Validate the source ID
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Source id is required'
    })
  }

  // Insert into user_sources table
  const result = await db.delete(userSources).where(and(
    eq(userSources.rssSourceId, Number(id)),
    eq(userSources.userId, user.sub)
  )).returning()

  return {
    success: true,
    data: result
  }
})