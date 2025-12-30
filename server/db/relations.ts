import { relations } from 'drizzle-orm'
import { users, tasks, pages } from './schema'

export const usersRelations = relations(users, ({ many }) => ({
  pages: many(pages),
  tasks: many(tasks)
}))

export const pagesRelations = relations(pages, ({ one, many }) => ({
  parent: one(pages, {
    relationName: 'page_parent',
    fields: [pages.parentId],
    references: [pages.id]
  }),
  children: many(pages, {
    relationName: 'page_parent'
  }),
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
