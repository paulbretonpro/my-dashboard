import { db } from "~~/server/db"
import { summary } from "~~/server/db/schema"
import { NewSummary } from "~~/shared/types"

export default defineEventHandler(async (event) => {
  const user = await requireUserAuth(event)
  const body = await readBody<NewSummary>(event)
  
  if (!body.content) {
    throw createError({
      statusCode: 400,
      statusMessage: "Content is required"
    })
  }

  const insertedSummary = await db
    .insert(summary)
    .values({
      ...body,
      userId: user.sub
    })
    .onConflictDoUpdate({
      target: summary.id,
      set: {
        content: body.content,
      }
    })
    .returning()

  return insertedSummary[0]
})