import { and, eq } from 'drizzle-orm'
import { db } from '~~/server/db'
import { tasks } from '~~/server/db/schema'
import { buildTaskUpdatePayload, TaskUpdateBody } from './services/update-service'

export default defineEventHandler(async (event) => {
  const user = await requireUserAuth(event)
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody<TaskUpdateBody>(event)

  if (!Number.isFinite(id) || id <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid task id' })
  }

  const task = await db.query.tasks.findFirst({
    where: and(eq(tasks.userId, user.sub), eq(tasks.id, id)),
    with: { page: true }
  })

  if (!task) {
    throw createError({ statusCode: 404, statusMessage: 'Task not found' })
  }

  const updatePayload = buildTaskUpdatePayload(body)

  await db
    .update(tasks)
    .set(updatePayload)
    .where(and(eq(tasks.id, id), eq(tasks.userId, user.sub)))

  return await db.query.tasks.findFirst({
    where: and(eq(tasks.userId, user.sub), eq(tasks.id, id)),
    with: { page: true }
  })
})
