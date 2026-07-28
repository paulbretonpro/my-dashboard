import { db } from '~~/server/db'
import { eq, count, and } from 'drizzle-orm'
import { rssSources, sourceTypes, articles } from '~~/server/db/schema'
import {
  articlesFiltersSchema,
  newFilter,
  periodFilter,
  readFilter,
  sourcesFilter,
  userFilter
} from './filters'

export default defineEventHandler(async (event) => {
  const user = await requireUserAuth(event)

  const query = validateQuery(event, articlesFiltersSchema)

  const filters = [
    userFilter(user.sub),
    sourcesFilter(query.sources),
    readFilter(user.sub, query.read),
    newFilter(query.latest, user.previousConnection),
    periodFilter(query.period)
  ].filter((filter) => !!filter)

  const articlesJoinCondition = filters.length
    ? and(eq(articles.sourceId, rssSources.id), ...filters)
    : eq(articles.sourceId, rssSources.id)

  const result = await db
    .select({ id: sourceTypes.id, label: sourceTypes.label, count: count(articles.id) })
    .from(sourceTypes)
    .leftJoin(rssSources, eq(rssSources.sourceTypeId, sourceTypes.id))
    .leftJoin(articles, articlesJoinCondition)
    .groupBy(sourceTypes.id, sourceTypes.label)

  return result
})
