import { and, eq } from 'drizzle-orm'
import { db } from '~~/server/db'
import { tasks } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const id = Number(getRouterParam(event, 'id'))

  if (!Number.isFinite(id) || id <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid task id' })
  }

  const task = await db.query.tasks.findFirst({
    where: and(eq(tasks.userId, user.id), eq(tasks.id, id)),
    with: { page: true }
  })

  if (!task) {
    throw createError({ statusCode: 404, statusMessage: 'Task not found' })
  }

  return task
})
