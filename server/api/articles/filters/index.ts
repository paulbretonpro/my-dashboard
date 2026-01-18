import { eq, SQL } from 'drizzle-orm'
import { articles } from '~~/server/db/schema'
import { z } from 'zod'


export const articlesFiltersSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  perPage: z.coerce.number().int().positive().optional(),
  search: z.string().trim().min(1).optional(),
})

export const userFilter = (userId: string): SQL => eq(articles.userId, userId)
