import { db } from '~~/server/db'
import { and, eq, isNull } from 'drizzle-orm'
import { pages } from '~~/server/db/schema'
import { requireUserAuth } from '~~/server/utils/user'

export default eventHandler(async (event) => {
  const user = await requireUserAuth(event)

  const response = await db.query.pages.findMany({
    where: and(eq(pages.userId, user.sub), isNull(pages.parentId)),
    orderBy: pages.name,
    with: { children: true }
  })

  return response
})
