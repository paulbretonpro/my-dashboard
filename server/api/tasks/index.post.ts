import { db } from '~~/server/db'
import { tasks } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody<NewTask>(event)
  const { user } = await requireUserSession(event)

  const newTask: NewTask = {
    ...body
  }
  const insertedTask = await db
    .insert(tasks)
    .values({
      ...newTask,
      userId: user.id
    })
    .returning()

  return insertedTask
})
