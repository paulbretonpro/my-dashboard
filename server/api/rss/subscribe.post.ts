import { db } from '~~/server/db'
import { rssSources, userSources } from '~~/server/db/schema'
import { and, eq } from 'drizzle-orm'
import { requireUserAuth } from '~~/server/utils/user'

export default defineEventHandler(async (event) => {
  const user = await requireUserAuth(event)
  const body = await readBody<{ url: string; name: string; siteUrl?: string }>(event)

  if (!body.url || !body.name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'URL and Name are required'
    })
  }

  // 1. Check if the RSS source already exists in our database
  let [source] = await db
    .select()
    .from(rssSources)
    .where(eq(rssSources.url, body.url))

  // 2. If it does not exist, insert it into rssSources
  if (!source) {
    const [newSource] = await db
      .insert(rssSources)
      .values({
        name: body.name,
        url: body.url,
        siteUrl: body.siteUrl || null,
        isActive: true
      })
      .returning()
    source = newSource
  }

  if (!source) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create or retrieve RSS source'
    })
  }

  const sourceId = source.id

  // 3. Check if the user is already subscribed to this source
  const [existingSubscription] = await db
    .select()
    .from(userSources)
    .where(and(eq(userSources.userId, user.sub), eq(userSources.rssSourceId, sourceId)))

  // 4. If not subscribed, create the subscription
  if (!existingSubscription) {
    await db
      .insert(userSources)
      .values({
        userId: user.sub,
        rssSourceId: sourceId
      })
  }

  return {
    success: true,
    sourceId: sourceId,
    isNewSubscription: !existingSubscription
  }
})
