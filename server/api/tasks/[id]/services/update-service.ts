import { tasks } from '~~/server/db/schema'

export type TaskUpdateBody = {
  title?: string
  content?: string | null
  status?: 'todo' | 'pending' | 'done'
  deadline?: string | Date | null
}

export function buildTaskUpdatePayload(body: TaskUpdateBody) {
  const { title, content, status, deadline } = body

  const updatePayload: Partial<typeof tasks.$inferInsert> = {}

  if (title !== undefined) {
    if (typeof title !== 'string' || !title.trim()) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid title value' })
    }
    updatePayload.title = title.trim()
  }

  if (content !== undefined) {
    if (content !== null && typeof content !== 'string') {
      throw createError({ statusCode: 400, statusMessage: 'Invalid content value' })
    }
    updatePayload.content = content
  }

  if (status !== undefined) {
    if (!['todo', 'pending', 'done'].includes(status)) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid status value' })
    }
    updatePayload.status = status
  }

  if (deadline !== undefined) {
    if (deadline === null) {
      updatePayload.deadline = null
    } else {
      const parsedDate = new Date(deadline)
      if (Number.isNaN(parsedDate.getTime())) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid deadline date' })
      }
      updatePayload.deadline = parsedDate
    }
  }

  if (!Object.keys(updatePayload).length) {
    throw createError({ statusCode: 400, statusMessage: 'No valid fields to update' })
  }

  return updatePayload
}
