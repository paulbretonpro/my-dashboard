import { and, desc, eq } from 'drizzle-orm'
import { db } from '~~/server/db'
import { notes } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  const user = await requireUserAuth(event)
  const id = Number(getRouterParam(event, 'id'))

  if (!id || !Number.isFinite(id) || id <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid note id' })
  }

  const note = await db
    .select()
    .from(notes)
    .where(and(eq(notes.id, id), eq(notes.userId, user.sub)))
    .orderBy(desc(notes.createdAt))

  return note ? note[0] : undefined
})
