import { db } from "~~/server/db"
import { articlesFiltersSchema, userFilter } from "./filters"
import { and, count, desc } from "drizzle-orm"
import { articles } from "~~/server/db/schema"

export default defineEventHandler(async (event) => {
  const user = await requireUserAuth(event)

  const query = validateQuery(event, articlesFiltersSchema)
  
  const filters = [
    userFilter(user.sub),
  ].filter((filter) => !!filter)

  const { limit, offset } = getPagination(query)

  const where = filters.length ? and(...filters) : undefined

  const [countResult] = await db.select({ total: count() }).from(articles).where(where)
  
    const data = await db.query.articles.findMany({
      where,
      limit,
      offset,
      orderBy: desc(articles.publishedAt),
      with: {
        source: true
      }
    })

  return {
    data,
    total: countResult?.total || 0
  }
})
