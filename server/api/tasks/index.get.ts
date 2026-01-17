import { and, asc, count, desc } from 'drizzle-orm'
import { db } from '~~/server/db'
import { tasks } from '~~/server/db/schema'
import validateQuery from '~~/server/utils/validateQuery'
import {
  createdAtFilters,
  deadlineFilter,
  deadlineRangeFilter,
  getSortColumn,
  searchFilter,
  statusFilter,
  taskFiltersSchema,
  userFilter
} from './filters'
import { getPagination } from '~~/server/utils/filters'

export default defineEventHandler(async (event) => {
  const user = await requireUserAuth(event)
  const query = validateQuery(event, taskFiltersSchema)

  const filters = [
    userFilter(user.sub),
    deadlineFilter(query.deadline),
    deadlineRangeFilter(query.deadlineFilter),
    statusFilter(query.status),
    searchFilter(query.search),
    ...createdAtFilters(query)
  ].filter((filter) => !!filter)

  const { limit, offset } = getPagination(query)

  const where = filters.length ? and(...filters) : undefined

  const sortColumn = getSortColumn(query.sortBy)
  const isDescending = ['true', '1'].includes(String(query.descending))

  const [countResult] = await db.select({ total: count() }).from(tasks).where(where)

  const data = await db.query.tasks.findMany({
    where,
    limit,
    offset,
    orderBy: isDescending ? desc(sortColumn) : asc(sortColumn),
    with: { page: true }
  })

  return {
    data,
    total: countResult?.total || 0
  }
})
