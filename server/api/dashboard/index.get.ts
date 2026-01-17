import { db } from '~~/server/db'
import { tasks } from '~~/server/db/schema'
import { getTodayRange, inLateTasksFilter, todayTasksFilter, userFilter } from './filters'
import { and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const user = await requireUserAuth(event)

  const { startOfToday, endOfToday } = getTodayRange()

  const filtersInLateTasks = [userFilter(user.sub), inLateTasksFilter(startOfToday)]
  const whereInLateTasks = filtersInLateTasks.length ? and(...filtersInLateTasks) : undefined
  const inLateTasksQuery = db.select().from(tasks).where(whereInLateTasks)

  const filtersTodayTasks = [userFilter(user.sub), todayTasksFilter(startOfToday, endOfToday)]
  const whereTodayTasks = filtersTodayTasks.length ? and(...filtersTodayTasks) : undefined
  const todayTasksQuery = db.select().from(tasks).where(whereTodayTasks)

  const [inLateTasks, todayTasks] = await Promise.all([inLateTasksQuery, todayTasksQuery])

  return {
    inLateTasks: inLateTasks.length ?? 0,
    todayTasks: todayTasks.length ?? 0
  }
})
