import { and, eq } from 'drizzle-orm'
import { db } from '~~/server/db'
import { userArticles } from '~~/server/db/schema'
import { ArticleUpdateBody, buildArticleUpdatePayload } from './services/update-service'

export default defineEventHandler(async (event) => {
  const user = await requireUserAuth(event)
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody<ArticleUpdateBody>(event)

  if (!Number.isFinite(id) || id <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid article id' })
  }

  const article = await db.query.userArticles.findFirst({
    where: and(eq(userArticles.userId, user.sub), eq(userArticles.articleId, id))
  })

  const updatePayload = buildArticleUpdatePayload(body)

  if (!article) {
    await db.insert(userArticles).values({
      userId: user.sub,
      articleId: id,
      ...updatePayload
    })
  }

  await db
    .update(userArticles)
    .set(updatePayload)
    .where(and(eq(userArticles.articleId, id), eq(userArticles.userId, user.sub)))
})
