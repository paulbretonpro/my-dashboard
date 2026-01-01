import { and, AnyColumn, asc, count, desc, eq, gte, ilike, lt, lte } from 'drizzle-orm'
import { db } from '~~/server/db'
import { tasks } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const query = getQuery(event)

  const filters = [eq(tasks.userId, user.id)]

  // Filtre par page_id
  const pageId = query.page_id ? Number(query.page_id) : undefined
  if (pageId && !Number.isNaN(pageId)) {
    filters.push(eq(tasks.pageId, pageId))
  }

  // Filtre par dates
  const createdAt = query.created_at ? new Date(String(query.created_at)) : undefined
  if (createdAt && !Number.isNaN(createdAt.getTime())) {
    filters.push(gte(tasks.createdAt, createdAt))
  }

  const createdBefore = query.created_before ? new Date(String(query.created_before)) : undefined
  if (createdBefore && !Number.isNaN(createdBefore.getTime())) {
    filters.push(lt(tasks.createdAt, createdBefore))
  }

  // Filtre par deadline
  const deadline = query.deadline ? new Date(String(query.deadline)) : undefined
  if (deadline && !Number.isNaN(deadline.getTime())) {
    filters.push(lte(tasks.deadline, deadline))
  }

  // Filtre par status
  const isDoneRaw = typeof query.is_done === 'string' ? query.is_done : undefined
  let isDone: boolean | undefined
  if (isDoneRaw === 'true' || isDoneRaw === '1') {
    isDone = true
  } else if (isDoneRaw === 'false' || isDoneRaw === '0') {
    isDone = false
  }

  if (typeof isDone === 'boolean') {
    filters.push(eq(tasks.isDone, isDone))
  }

  // Filtre par contenu
  const search = typeof query.search === 'string' ? query.search.trim() : ''
  if (search) {
    filters.push(ilike(tasks.content, `%${search}%`))
  }

  // Pagination
  const page = query.page ? Number(query.page) : 1
  const perPage = query.per_page ? Number(query.per_page) : 10
  const limit = Number.isFinite(perPage) && perPage > 0 ? perPage : 10
  const currentPage = Number.isFinite(page) && page > 0 ? page : 1
  const offset = (currentPage - 1) * limit

  const sortBy = typeof query.sort_by === 'string' ? query.sort_by : undefined
  const isDescending =
    typeof query.descending === 'string' ? ['true', '1'].includes(query.descending) : false

  let sortColumn: AnyColumn
  switch (sortBy) {
    case 'createdAt':
      sortColumn = tasks.createdAt
      break
    case 'deadline':
      sortColumn = tasks.deadline
      break
    default:
      sortColumn = tasks.createdAt
  }

  const where = filters.length ? and(...filters) : undefined

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
