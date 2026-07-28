import { relations } from 'drizzle-orm/relations'
import { pages, users, tasks } from './schema'

export const pagesRelations = relations(pages, ({ one, many }) => ({
  page: one(pages, {
    fields: [pages.parentId],
    references: [pages.id],
    relationName: 'pages_parentId_pages_id'
  }),
  pages: many(pages, {
    relationName: 'pages_parentId_pages_id'
  }),
  user: one(users, {
    fields: [pages.userId],
    references: [users.id]
  }),
  tasks: many(tasks)
}))

export const usersRelations = relations(users, ({ many }) => ({
  pages: many(pages),
  tasks: many(tasks)
}))

export const tasksRelations = relations(tasks, ({ one }) => ({
  page: one(pages, {
    fields: [tasks.pageId],
    references: [pages.id]
  }),
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id]
  })
}))
