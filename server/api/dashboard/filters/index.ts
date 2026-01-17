import { and, eq, gte, lt } from 'drizzle-orm'
import { tasks } from '~~/server/db/schema'

export const getTodayRange = (now: Date = new Date()) => {
  const startOfToday = new Date(now)
  startOfToday.setHours(0, 0, 0, 0)

  const endOfToday = new Date(now)
  endOfToday.setHours(23, 59, 59, 999)

  return { startOfToday, endOfToday }
}

export const userFilter = (userId: string) => eq(tasks.userId, userId)

export const inLateTasksFilter = (startOfToday: Date) =>
  and(eq(tasks.isDone, false), lt(tasks.deadline, startOfToday))

export const todayTasksFilter = (startOfToday: Date, endOfToday: Date) =>
  and(eq(tasks.isDone, false), gte(tasks.deadline, startOfToday), lt(tasks.deadline, endOfToday))
