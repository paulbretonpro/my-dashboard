import { and, AnyColumn, eq, gte, ilike, lt, lte, SQL } from 'drizzle-orm'
import { tasks } from '~~/server/db/schema'
import { z } from 'zod'
import { parseBoolean, parseDate } from '~~/server/utils/filters'

const dateSchema = z.preprocess((value) => {
  if (typeof value === 'string' || value instanceof Date) {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? undefined : date
  }
  return undefined
}, z.date().optional())

export const taskFiltersSchema = z.object({
  createdAt: dateSchema,
  createdBefore: dateSchema,
  deadline: dateSchema,
  deadlineFilter: z.enum(['no-deadline', 'overdue', 'today', 'this-week', 'this-month']).optional(),
  descending: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().optional(),
  pageId: z.coerce.number().int().positive().optional(),
  perPage: z.coerce.number().int().positive().optional(),
  search: z.string().trim().min(1).optional(),
  sortBy: z.enum(['created_at', 'deadline']).optional(),
  status: z.enum(['all', 'true', 'false']).optional()
})

export const getSortColumn = (sortBy?: string): AnyColumn => {
  switch (sortBy) {
    case 'deadline':
      return tasks.deadline
    case 'createdAt':
    default:
      return tasks.createdAt
  }
}

export const searchFilter = (value?: unknown): SQL | undefined => {
  if (typeof value !== 'string') return
  const search = value.trim()
  return search ? ilike(tasks.content, `%${search}%`) : undefined
}

export const statusFilter = (value?: string): SQL | undefined => {
  const isDone = parseBoolean(value)
  return typeof isDone === 'boolean' ? eq(tasks.isDone, isDone) : undefined
}

export const deadlineRangeFilter = (filter?: string): SQL | undefined => {
  if (!filter) return

  const now = new Date()

  const startOfToday = new Date(now)
  startOfToday.setHours(0, 0, 0, 0)

  const endOfToday = new Date(now)
  endOfToday.setHours(23, 59, 59, 999)

  switch (filter) {
    case 'no-deadline':
      return eq(tasks.deadline, null)

    case 'overdue':
      return and(lte(tasks.deadline, now), eq(tasks.isDone, false))

    case 'today':
      return and(gte(tasks.deadline, startOfToday), lte(tasks.deadline, endOfToday))

    case 'this-week': {
      const startOfWeek = new Date(startOfToday)
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1)

      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(endOfWeek.getDate() + 6)
      endOfWeek.setHours(23, 59, 59, 999)

      return and(gte(tasks.deadline, startOfWeek), lte(tasks.deadline, endOfWeek))
    }

    case 'this-month': {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      endOfMonth.setHours(23, 59, 59, 999)

      return and(gte(tasks.deadline, startOfMonth), lte(tasks.deadline, endOfMonth))
    }
  }
}

export const deadlineFilter = (value?: unknown): SQL | undefined => {
  const deadline = parseDate(value)
  return deadline ? lte(tasks.deadline, deadline) : undefined
}

export const createdAtFilters = (query: TaskFilters): SQL[] => {
  const filters: SQL[] = []

  const createdAt = parseDate(query.createdAt)
  if (createdAt) {
    filters.push(eq(tasks.createdAt, createdAt))
  }

  const createdBefore = parseDate(query.createdBefore)
  if (createdBefore) {
    filters.push(lt(tasks.createdAt, createdBefore))
  }

  return filters
}

export const userFilter = (userId: number): SQL => eq(tasks.userId, userId)
