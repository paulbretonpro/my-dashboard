import { db } from '~~/server/db'
import { tasks } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody<any>(event)
  const user = await requireUserAuth(event)

  const deadline = body.deadline ? new Date(body.deadline) : null
  if (deadline && Number.isNaN(deadline.getTime())) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid deadline date' })
  }

  const insertedTask = await db
    .insert(tasks)
    .values({
      title: body.title,
      content: body.content,
      status: body.status || 'todo',
      deadline: deadline,
      userId: user.sub
    })
    .returning()

  return insertedTask
})
