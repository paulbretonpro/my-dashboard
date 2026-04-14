import { db } from '~~/server/db'
import { summary, summaryArticles } from '~~/server/db/schema'
import { NewSummary } from '~~/shared/types'

export default defineEventHandler(async (event) => {
  const user = await requireUserAuth(event)
  const body = await readBody<NewSummary>(event)

  const insertedSummary = await db
    .insert(summary)
    .values({
      ...body,
      userId: user.sub
    })
    .returning()

  if (body.url || body.articleId) {
    await db.insert(summaryArticles).values({
      summaryId: insertedSummary[0].id,
      articleId: body.articleId,
      url: body.url ?? ''
    })
  }

  return insertedSummary[0]
})  