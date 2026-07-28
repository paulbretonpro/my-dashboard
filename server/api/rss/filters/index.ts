import { eq, ilike, inArray, SQL } from 'drizzle-orm'
import { rssSources, userSources } from '~~/server/db/schema'
import { z } from 'zod'
import { db } from '~~/server/db'

export const rssSourceFiltersSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  perPage: z.coerce.number().int().positive().optional(),
  search: z.string().trim().min(1).optional()
})

export const searchFilter = (value?: unknown): SQL | undefined => {
  if (typeof value !== 'string') return
  const search = value.trim()
  return search ? ilike(rssSources.name, `%${search}%`) : undefined
}

export const userFilter = (userId: string): SQL =>
  inArray(
    rssSources.id,
    db
      .select({ id: userSources.rssSourceId })
      .from(userSources)
      .where(eq(userSources.userId, userId))
  )
