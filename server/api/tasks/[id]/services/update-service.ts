import { tasks } from '~~/server/db/schema'

export type TaskUpdateBody = {
  isDone?: boolean
  additionalNotes?: string | null
}

export function buildTaskUpdatePayload(body: TaskUpdateBody) {
  const { isDone, additionalNotes } = body

  const updatePayload: Partial<typeof tasks.$inferInsert> = {}

  if (isDone !== undefined) {
    if (typeof isDone !== 'boolean') {
      throw createError({ statusCode: 400, statusMessage: 'Invalid isDone value' })
    }

    updatePayload.isDone = isDone
  }

  if (additionalNotes !== undefined) {
    if (additionalNotes !== null && typeof additionalNotes !== 'string') {
      throw createError({ statusCode: 400, statusMessage: 'Invalid additionalNotes value' })
    }

    updatePayload.additionalNotes = additionalNotes
  }

  if (!Object.keys(updatePayload).length) {
    throw createError({ statusCode: 400, statusMessage: 'No valid fields to update' })
  }

  return updatePayload
}
