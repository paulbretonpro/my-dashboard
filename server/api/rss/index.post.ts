import { db } from '~~/server/db'
import { rssSources } from '~~/server/db/schema'
import { NewRssSource } from '~~/shared/types'

export default defineEventHandler(async (event) => {
  await requireUserAuth(event)
  const body = await readBody<NewRssSource>(event)

  if (!body.name || !body.url) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name and URL are required'
    })
  }

  const insertedRss = await db
    .insert(rssSources)
    .values({
      ...body
    })
    .returning()

  return insertedRss
})
