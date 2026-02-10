import { and, count, eq } from 'drizzle-orm'
import { db } from '~~/server/db'
import { articles, userArticles, users } from '~~/server/db/schema'
import validateQuery from '~~/server/utils/validateQuery'
import { getPagination } from '~~/server/utils/filters'
import {
  articlesFiltersSchema,
  newFilter,
  periodFilter,
  readFilter,
  sourcesFilter,
  userFilter,
  sourceTypesFilter
} from './filters'

export default defineEventHandler(async (event) => {
  const userSession = await requireUserAuth(event)
  const query = validateQuery(event, articlesFiltersSchema)

  const [user] = await db.select().from(users).where(eq(users.id, userSession.sub))
  
  const filters = [
    userFilter(user.id),
    sourcesFilter(query.sources),
    readFilter(user.id, query.read),
    newFilter(query.latest, user.previousConnection),
    periodFilter(query.period),
    sourceTypesFilter(query.sourcesTypes)
  ].filter((filter) => !!filter)

  const where = filters.length ? and(...filters) : undefined
  const { limit, offset } = getPagination(query)

  const [{ total }] = await db
    .select({ total: count() })
    .from(articles)
    .where(where)

  const data = await db.query.articles.findMany({
    where,
    with: {
      source: true,
      userArticles: {
        where: eq(userArticles.userId, user.id),
      },
      summary: true
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
