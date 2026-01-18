import { and, eq } from 'drizzle-orm'
import { db } from '~~/server/db'
import { articles } from '~~/server/db/schema'
import { ArticleUpdateBody, buildArticleUpdatePayload } from './services/update-service'

export default defineEventHandler(async (event) => {
  const user = await requireUserAuth(event)
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody<ArticleUpdateBody>(event)

  if (!Number.isFinite(id) || id <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid article id' })
  }

  const article = await db.query.articles.findFirst({
    where: and(eq(articles.userId, user.sub), eq(articles.id, id)),
  })

  if (!article) {
    throw createError({ statusCode: 404, statusMessage: 'Article not found' })
  }

  const updatePayload = buildArticleUpdatePayload(body)

  await db
    .update(articles)
    .set(updatePayload)
    .where(and(eq(articles.id, id), eq(articles.userId, user.sub))) 
    
})
