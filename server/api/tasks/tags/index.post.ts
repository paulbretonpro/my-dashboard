import { db } from '~~/server/db'
import { taskTags } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody<any>(event)
  const user = await requireUserAuth(event)

  if (!body.name || !body.name.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Tag name is required' })
  }

  const newTag = await db
    .insert(taskTags)
    .values({
      name: body.name.trim(),
      color: body.color || '#3b82f6',
      userId: user.sub
    })
    .returning()

  return newTag[0]
})
