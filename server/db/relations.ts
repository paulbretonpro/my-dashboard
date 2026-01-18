import { relations } from 'drizzle-orm'
import { users, tasks, pages, rssSources, articles } from './schema'

export const usersRelations = relations(users, ({ many }) => ({
  pages: many(pages),
  tasks: many(tasks),
  rssSources: many(rssSources),
  articles: many(articles)
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

export const rssSourcesRelations = relations(rssSources, ({ one, many }) => ({
  user: one(users, {
    fields: [rssSources.userId],
    references: [users.id]
  }),
  articles: many(articles)
}))

export const articlesRelations = relations(articles, ({ one }) => ({
  source: one(rssSources, {
    fields: [articles.sourceId],
    references: [rssSources.id]
  }),
  user: one(users, {
    fields: [articles.userId],
    references: [users.id]
  })
}))
