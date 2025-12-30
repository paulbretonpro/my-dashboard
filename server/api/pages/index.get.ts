import { db } from '~~/server/db'
import { and, eq, isNull } from 'drizzle-orm'
import { pages } from '~~/server/db/schema'

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const response = await db.query.pages.findMany({
    where: and(eq(pages.userId, user.id), isNull(pages.parentId)),
    orderBy: pages.name,
    with: { children: true }
  })

  return response
})
