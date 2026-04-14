import { db } from '~~/server/db'
import { notes } from '~~/server/db/schema'
import { NewNote } from '~~/shared/types'

export default defineEventHandler(async (event) => {
  const body = await readBody<NewNote>(event)
  const user = await requireUserAuth(event)

  const newNote: NewNote = {
    ...body
  }
  const insertedNote = await db
    .insert(notes)
    .values({
      ...newNote,
      userId: user.sub
    })
    .returning()

  return insertedNote ? insertedNote[0] : undefined
})
