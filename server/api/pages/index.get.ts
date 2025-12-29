import { db, schema } from 'hub:db'
import { eq } from 'drizzle-orm'

export default eventHandler(async (event) => {
  const pages = await db.select().from(schema.pages).where(eq(schema.pages.isFavorite, true))

  return pages
})
