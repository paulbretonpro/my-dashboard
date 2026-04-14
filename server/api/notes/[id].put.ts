import { eq } from 'drizzle-orm'
import { db } from '~~/server/db'
import { notes } from '~~/server/db/schema'
import { NewNote } from '~~/shared/types'

export default defineEventHandler(async (event) => {
  const body = await readBody<NewNote>(event)
  const user = await requireUserAuth(event)
  const id = Number(getRouterParam(event, 'id')) || body.id

  if (!id || !Number.isFinite(id) || id <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid note id' })
  }

  const newNote: NewNote = {
    ...body
  }
  const updatedNote = await db
    .update(notes)
    .set({
      ...newNote,
      userId: user.sub
    })
    .where(eq(notes.id, id))
    .returning()

  return updatedNote ? updatedNote[0] : undefined
})
