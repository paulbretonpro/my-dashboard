import { userArticles } from '~~/server/db/schema'

export type ArticleUpdateBody = {
  read?: boolean
}

export function buildArticleUpdatePayload(body: ArticleUpdateBody) {
  const { read } = body

  const updatePayload: Partial<typeof userArticles.$inferInsert> = {}

  if (read !== undefined) {
    if (typeof read !== 'boolean') {
      throw createError({ statusCode: 400, statusMessage: 'Invalid read value' })
    }

    updatePayload.isRead = read
  }

  if (!Object.keys(updatePayload).length) {
    throw createError({ statusCode: 400, statusMessage: 'No valid fields to update' })
  }

  return updatePayload
}
