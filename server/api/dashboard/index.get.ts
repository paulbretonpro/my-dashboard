import { db } from '~~/server/db'
import { articles, tasks, userArticles, users, userSources } from '~~/server/db/schema'
import { getTodayRange, inLateTasksFilter, newArticlesFilter, todayTasksFilter, userFilter } from './filters'
import { and, eq, inArray } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const authUser = await requireUserAuth(event)

  // Récupérer l'utilisateur avec sa dernière connexion
  const [user] = await db.select().from(users).where(eq(users.id, authUser.sub))

  const { startOfToday, endOfToday } = getTodayRange()

  const filtersInLateTasks = [userFilter(authUser.sub), inLateTasksFilter(startOfToday)]
  const whereInLateTasks = filtersInLateTasks.length ? and(...filtersInLateTasks) : undefined
  const inLateTasksQuery = db.select().from(tasks).where(whereInLateTasks)

  const filtersTodayTasks = [userFilter(authUser.sub), todayTasksFilter(startOfToday, endOfToday)]
  const whereTodayTasks = filtersTodayTasks.length ? and(...filtersTodayTasks) : undefined
  const todayTasksQuery = db.select().from(tasks).where(whereTodayTasks)

  // Récupérer les sources RSS de l'utilisateur
  const userRssSources = await db
    .select({ rssSourceId: userSources.rssSourceId })
    .from(userSources)
    .where(eq(userSources.userId, authUser.sub))

  // Compter les nouveaux articles depuis la dernière connexion
  let newArticlesCount = 0
  if (user.previousConnection && userRssSources.length > 0) {
    const sourceIds = userRssSources.map((s) => s.rssSourceId)
    const newArticles = await db
      .select()
      .from(articles)
      .where(
        and(
          inArray(articles.sourceId, sourceIds),
          newArticlesFilter(user.previousConnection)
        )
      )
    newArticlesCount = newArticles.length
  }

  const [inLateTasks, todayTasks] = await Promise.all([inLateTasksQuery, todayTasksQuery])

  return {
    inLateTasks: inLateTasks.length ?? 0,
    todayTasks: todayTasks.length ?? 0,
    newArticles: newArticlesCount
  }
})
