import { and, eq, gte, lt } from 'drizzle-orm'
import { db } from '~~/server/db'
import { tasks } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const now = new Date()
  const startOfToday = new Date(now)
  startOfToday.setHours(0, 0, 0, 0)
  const endOfToday = new Date(now)
  endOfToday.setHours(23, 59, 59, 999)

  const inLateTasksQuery = db
    .select()
    .from(tasks)
    .where(
      and(eq(tasks.userId, user.id), eq(tasks.isDone, false), lt(tasks.deadline, startOfToday))
    )

  const todayTasksQuery = db
    .select()
    .from(tasks)
    .where(
      and(
        eq(tasks.userId, user.id),
        eq(tasks.isDone, false),
        gte(tasks.deadline, startOfToday),
        lt(tasks.deadline, endOfToday)
      )
    )

  const [inLateTasks, todayTasks] = await Promise.all([inLateTasksQuery, todayTasksQuery])

  return {
    inLateTasks: inLateTasks.length ?? 0,
    todayTasks: todayTasks.length ?? 0
  }
})
