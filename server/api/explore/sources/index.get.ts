import { db } from '~~/server/db'
import { count, eq } from 'drizzle-orm'
import { rssSources, userSources } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  const user = await requireUserAuth(event)
  const query = getQuery(event)

  const { limit, offset } = getPagination(query)

  const [{ total }] = await db
    .select({ total: count() })
    .from(rssSources)

  const data = await db.query.rssSources.findMany({
    limit,
    offset,
    orderBy: (rssSources, { asc }) => [
      asc(rssSources.name),
    ],
    with: {
      userSources: {
        where: eq(userSources.userId, user.sub),
        columns: {
          userId: true, // minimal
        },
      },
    },
  })
  
  const sources = data.map((source) => ({
    ...source,
    isSubscribed: source.userSources.length > 0,
    userSources: undefined, // optionnel : nettoyer la réponse
  })).filter((source) => !source.isSubscribed)

  return {
    data: sources,
    total: total ?? 0,
  }
})
