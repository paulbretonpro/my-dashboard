import { db } from '~~/server/db'
import { and, count, eq } from 'drizzle-orm'
import { notes } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  const user = await requireUserAuth(event)
  const query = getQuery(event)

  const { limit, offset } = getPagination(query)

  const [{ total }] = await db
  .select({
    total: count(),
  })
  .from(notes)
  .where(
    and(
      eq(notes.userId, user.sub)
    )
  )

  const sources = await db
    .select()
    .from(notes)
    .where(
      and(
        eq(notes.userId, user.sub)
      )
    )
    .orderBy(notes.createdAt)
    .limit(limit)
    .offset(offset)
  
  return {
    data: sources,
    total: total ?? 0,
  }
})
