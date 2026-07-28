import { db } from '~~/server/db'
import { and, count, eq, isNull } from 'drizzle-orm'
import { rssSources, userSources } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  const user = await requireUserAuth(event)
  const query = getQuery(event)

  const { limit, offset } = getPagination(query)

  const [{ total }] = await db
    .select({
      total: count()
    })
    .from(rssSources)
    .leftJoin(
      userSources,
      and(eq(userSources.rssSourceId, rssSources.id), eq(userSources.userId, user.sub))
    )
    .where(and(isNull(userSources.userId), eq(rssSources.isActive, true)))

  const sources = await db
    .select({
      id: rssSources.id,
      name: rssSources.name,
      url: rssSources.url,
      siteUrl: rssSources.siteUrl,
      isActive: rssSources.isActive,
      createdAt: rssSources.createdAt
    })
    .from(rssSources)
    .leftJoin(
      userSources,
      and(eq(userSources.rssSourceId, rssSources.id), eq(userSources.userId, user.sub))
    )
    .where(and(isNull(userSources.userId), eq(rssSources.isActive, true)))
    .orderBy(rssSources.createdAt)
    .limit(limit)
    .offset(offset)

  const sourcesFormated = sources.map((source) => ({
    ...source,
    isSubscribed: false
  }))

  return {
    data: sourcesFormated,
    total: total ?? 0
  }
})
