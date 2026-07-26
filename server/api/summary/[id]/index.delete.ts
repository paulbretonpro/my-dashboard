import { and, eq } from 'drizzle-orm'
import { db } from '~~/server/db'
import { summary } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  const user = await requireUserAuth(event)
  const id = Number(getRouterParam(event, 'id'))

  
  if (!Number.isFinite(id) || id <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid summary id' })
  }

  const where = and(eq(summary.userId, user.sub), eq(summary.id, id))

  const existingSummary = await db.query.summary.findFirst({
    where
  })

  if (!existingSummary) {
    throw createError({ statusCode: 404, statusMessage: 'Résumé non trouvé' })
  }

  return await db
    .delete(summary)
    .where(where)
})