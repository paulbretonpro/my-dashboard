import { count, eq } from "drizzle-orm"
import { db } from "~~/server/db"
import { summary } from "~~/server/db/schema"
import { summaryFiltersSchema } from "./filters"

export default defineEventHandler(async (event) => {
  const user = await requireUserAuth(event)

  const query = validateQuery(event, summaryFiltersSchema)

  const { limit, offset } = getPagination(query)

  const where = eq(summary.userId, user.sub)

  const [{ total }] = await db
    .select({ total: count() })
    .from(summary)
    .where(where)

  const response = await db.query.summary.findMany({
    where,
    limit,
    offset,
    orderBy: (summary, { desc }) => [
      desc(summary.createdAt)
    ]
  })

  return {
    data: response,
    total: total ?? 0,
  }
})