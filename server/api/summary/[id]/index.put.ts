import { and, eq } from 'drizzle-orm'
import { db } from '~~/server/db'
import { summary } from '~~/server/db/schema'
import { NewSummary } from '~~/shared/types'

export default defineEventHandler(async (event) => {
  const user = await requireUserAuth(event)
  const body = await readBody<NewSummary>(event)
  const id = Number(getRouterParam(event, 'id'))

  if (!Number.isFinite(id) || id <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid summary id' })
  }

  if (!body.content || !body.title) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Content and title are required'
    })
  }

  const where = and(eq(summary.userId, user.sub), eq(summary.id, id))

  const existingSummary = await db.query.summary.findFirst({
    where
  })

  if (!existingSummary) {
    throw createError({ statusCode: 404, statusMessage: 'Résumé non trouvé' })
  }

  const updatedSummary = await db
    .update(summary)
    .set({
      ...body
    })
    .where(where)
})
