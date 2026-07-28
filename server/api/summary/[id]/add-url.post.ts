// API pour ajouter une url à un résumé id à la table summaryArticles

import z from 'zod'
import { db } from '~~/server/db'
import { summaryArticles } from '~~/server/db/schema'

interface NewSummaryArticles {
  url: string
}

export default defineEventHandler(async (event) => {
  const user = await requireUserAuth(event)
  const { url } = await readBody<NewSummaryArticles>(event)
  const id = Number(getRouterParam(event, 'id'))

  if (!Number.isFinite(id) || id <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid summary id' })
  }

  if (!url) {
    throw createError({
      statusCode: 400,
      message: 'URL is required'
    })
  }

  await db.insert(summaryArticles).values({
    summaryId: id,
    url
  })
})
