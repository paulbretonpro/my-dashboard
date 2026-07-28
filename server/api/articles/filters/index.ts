import { and, eq, exists, gte, inArray, isNotNull, not, SQL } from 'drizzle-orm'
import { articles, rssSources, userArticles, userSources } from '~~/server/db/schema'
import { z } from 'zod'
import { db } from '~~/server/db'
import { isValidDate, parseBoolean, parseDate } from '~~/server/utils/filters'

export const articlesFiltersSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  perPage: z.coerce.number().int().positive().optional(),
  period: z.enum(['24h', '7d', '30d']).optional(),
  read: z.enum(['all', 'read', 'unread']).optional(),
  latest: z.coerce.string().optional(),
  sources: z
    .union([
      z.array(z.coerce.number().int().positive()).optional(),
      z.coerce.number().int().positive().optional()
    ])
    .transform((value) => {
      if (Array.isArray(value)) return value
      if (typeof value === 'number') return [value]
      return []
    }),
  sourcesTypes: z
    .union([
      z.array(z.coerce.number().int().positive()).optional(),
      z.coerce.number().int().positive().optional()
    ])
    .transform((value) => {
      if (Array.isArray(value)) return value
      if (typeof value === 'number') return [value]
      return []
    })
})

export type ArticlesFilters = z.infer<typeof articlesFiltersSchema>

export const userFilter = (userId: string): SQL =>
  exists(
    db
      .select({ one: userSources.userId })
      .from(userSources)
      .where(and(eq(userSources.userId, userId), eq(userSources.rssSourceId, articles.sourceId)))
  )

const periodToDate = (period?: string): Date | undefined => {
  if (!period) return

  const now = new Date()
  switch (period) {
    case '24h':
      return new Date(now.getTime() - 24 * 60 * 60 * 1000)
    case '7d':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    case '30d':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  }
}

export const periodFilter = (period?: string): SQL | undefined => {
  const since = periodToDate(period)

  if (!since) return
  return and(isNotNull(articles.publishedAt), gte(articles.publishedAt, since))
}

export const sourcesFilter = (sources?: number[]): SQL | undefined => {
  if (!sources?.length) return
  return inArray(articles.sourceId, sources)
}

export const readFilter = (userId: string, value?: string): SQL | undefined => {
  if (!value || value === 'all') return

  const readExists = exists(
    db
      .select({ one: userArticles.articleId })
      .from(userArticles)
      .where(
        and(
          eq(userArticles.userId, userId),
          eq(userArticles.articleId, articles.id),
          eq(userArticles.isRead, true)
        )
      )
  )

  if (value === 'read') return readExists
  if (value === 'unread') return not(readExists)
}

export const newFilter = (
  value?: unknown,
  lastSignInAt?: string | Date | null
): SQL | undefined => {
  const isNew = typeof value === 'boolean' ? value : parseBoolean(value)

  if (!isNew) return

  const lastLogin = parseDate(lastSignInAt ?? undefined)

  if (!lastLogin || !isValidDate(lastLogin)) return

  return and(isNotNull(articles.publishedAt), gte(articles.publishedAt, lastLogin))
}

export const sourceTypesFilter = (sourceTypeIds?: number[]): SQL | undefined => {
  if (!sourceTypeIds?.length) return
  return exists(
    db
      .select({ one: rssSources.id })
      .from(rssSources)
      .where(
        and(inArray(rssSources.sourceTypeId, sourceTypeIds), eq(rssSources.id, articles.sourceId))
      )
  )
}
