import { db } from '~~/server/db'
import { and, count, eq, exists } from 'drizzle-orm'
import { articles, userArticles, userSources } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  const user = await requireUserAuth(event)
  const query = getQuery(event)

  const { limit, offset } = getPagination(query) // ex: limit=10

  const where = exists(
    db
      .select({ one: userSources.userId })
      .from(userSources)
      .where(
        and(
          eq(userSources.userId, user.sub),
          eq(userSources.rssSourceId, articles.sourceId)
        )
      )
  )

  const [{ total }] = await db
    .select({ total: count() })
    .from(articles)
    .where(where)

  const data = await db.query.articles.findMany({
    where,
    with: {
      source: true,
      userArticles: {
        where: eq(userArticles.userId, user.sub),
      },
    },
    orderBy: (articles, { desc }) => [
      desc(articles.publishedAt),
    ],
    limit,
    offset,
  })

  const articlesFormated = data.map((article) => {
    const userArticle = article.userArticles[0]

    return {
      ...article,
      isFavorite: userArticle?.isFavorite ?? false,
      isRead: userArticle?.isRead ?? false,
    }
  })

  return {
    data: articlesFormated,
    total: total ?? 0,
  }
})
