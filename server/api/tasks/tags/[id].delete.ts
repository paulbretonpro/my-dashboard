import { and, eq } from 'drizzle-orm'
import { db } from '~~/server/db'
import { taskTags } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  const user = await requireUserAuth(event)
  const id = Number(getRouterParam(event, 'id'))

  if (!Number.isFinite(id) || id <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid tag id' })
  }

  const tag = await db.query.taskTags.findFirst({
    where: and(eq(taskTags.userId, user.sub), eq(taskTags.id, id))
  })

  if (!tag) {
    throw createError({ statusCode: 404, statusMessage: 'Tag not found' })
  }

  await db.delete(taskTags).where(and(eq(taskTags.id, id), eq(taskTags.userId, user.sub)))

  return { success: true }
})
