import { and, eq } from 'drizzle-orm'
import { db } from '~~/server/db'
import { userGithubRepositories } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const user = await requireUserAuth(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "L'identifiant est obligatoire."
    })
  }

  const result = await db
    .delete(userGithubRepositories)
    .where(
      and(
        eq(userGithubRepositories.id, Number(id)),
        eq(userGithubRepositories.userId, user.sub)
      )
    )
    .returning()

  return {
    success: true,
    data: result
  }
})
