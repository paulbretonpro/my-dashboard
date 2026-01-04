import { and, eq } from 'drizzle-orm'
import { db } from '~~/server/db'
import { tasks } from '~~/server/db/schema'
import { buildTaskUpdatePayload, type TaskUpdateBody } from './updatePayload'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody<TaskUpdateBody>(event)

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

  const updatePayload = buildTaskUpdatePayload(body)

  return await db
    .update(tasks)
    .set(updatePayload)
    .where(and(eq(tasks.id, id), eq(tasks.userId, user.id)))
})
