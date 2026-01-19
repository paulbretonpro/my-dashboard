import { db } from '~~/server/db'
import { rssSourceFiltersSchema, searchFilter, userFilter } from './filters'
import { and, count } from 'drizzle-orm'
import { rssSources } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  const user = await requireUserAuth(event)
  const query = validateQuery(event, rssSourceFiltersSchema)

  const filters = [
    userFilter(user.sub),
    searchFilter(query.search),
  ].filter(Boolean)

  const { limit, offset } = getPagination(query)
  const where = filters.length ? and(...filters) : undefined

  const [{ total }] = await db
    .select({ total: count() })
    .from(rssSources)
    .where(where)

  const data = await db.query.rssSources.findMany({
    where,
    limit,
    offset,
  })

  return {
    data,
    total: total ?? 0,
  }
})
