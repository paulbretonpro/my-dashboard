import { users, tasks, pages } from '~~/server/db/schema'

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Page = typeof pages.$inferSelect
export type PageWithChildren = Page & { children: Page[] }
export type NewPage = typeof pages.$inferInsert

export type Task = typeof tasks.$inferSelect
export type NewTask = typeof tasks.$inferInsert
