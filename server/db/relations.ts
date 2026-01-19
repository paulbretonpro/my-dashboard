import { relations } from 'drizzle-orm'
import {
  users,
  pages,
  tasks,
  rssSources,
  articles,
  userSources,
  userArticles
} from './schema'

export const usersRelations = relations(users, ({ many }) => ({
  pages: many(pages),
  tasks: many(tasks),

  userSources: many(userSources),
  userArticles: many(userArticles)
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
  tasks: many(tasks),
  user: one(users, {
    fields: [pages.userId],
    references: [users.id]
  })
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


export const rssSourcesRelations = relations(rssSources, ({ many }) => ({
  articles: many(articles),
  userSources: many(userSources)
}))


export const articlesRelations = relations(articles, ({ one, many }) => ({
  source: one(rssSources, {
    fields: [articles.sourceId],
    references: [rssSources.id]
  }),
  userArticles: many(userArticles)
}))


export const userSourcesRelations = relations(userSources, ({ one }) => ({
  user: one(users, {
    fields: [userSources.userId],
    references: [users.id]
  }),
  source: one(rssSources, {
    fields: [userSources.rssSourceId],
    references: [rssSources.id]
  })
}))


export const userArticlesRelations = relations(userArticles, ({ one }) => ({
  user: one(users, {
    fields: [userArticles.userId],
    references: [users.id]
  }),
  article: one(articles, {
    fields: [userArticles.articleId],
    references: [articles.id]
  })
}))
