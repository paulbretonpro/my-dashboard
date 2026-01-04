import type { H3Event } from 'h3'
import { getQuery, createError } from 'h3'
import { ZodSchema } from 'zod'

export default function <T>(event: H3Event, schema: ZodSchema<T>): T {
  const rawQuery = getQuery(event)

  const parsed = schema.safeParse(rawQuery)

  if (!parsed.success) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Invalid query parameters',
      data: parsed.error.flatten()
    })
  }

  return parsed.data
}
