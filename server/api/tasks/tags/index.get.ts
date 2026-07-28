import { eq } from 'drizzle-orm'
import { db } from '~~/server/db'
import { taskTags } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  const user = await requireUserAuth(event)

  const tagsList = await db.query.taskTags.findMany({
    where: eq(taskTags.userId, user.sub),
    orderBy: taskTags.createdAt
  })

  return tagsList
})
