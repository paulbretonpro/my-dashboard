import { relations } from 'drizzle-orm'
import {
  users,
  pages,
  tasks,
  rssSources,
  articles,
  userSources,
  userArticles,
  sourceTypes,
  sourceTags,
  sourceTagsRelationship,
  summary,
  summaryArticles
} from './schema'

export const usersRelations = relations(users, ({ many }) => ({
  pages: many(pages),
  tasks: many(tasks),
  summary: many(summary),
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
  user: one(users, {
    fields: [pages.userId],
    references: [users.id]
  })
}))

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id]
  })
}))

export const rssSourcesRelations = relations(rssSources, ({ many, one }) => ({
  articles: many(articles),
  userSources: many(userSources),
  sourceType: one(sourceTypes, {
    fields: [rssSources.sourceTypeId],
    references: [sourceTypes.id]
  }),
  tags: many(sourceTagsRelationship)
}))

export const articlesRelations = relations(articles, ({ one, many }) => ({
  source: one(rssSources, {
    fields: [articles.sourceId],
    references: [rssSources.id]
  }),
  userArticles: many(userArticles),
  summary: one(summaryArticles, {
    fields: [articles.id],
    references: [summaryArticles.articleId]
  })
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

export const sourceTypesRelations = relations(sourceTypes, ({ many }) => ({
  rssSources: many(rssSources)
}))

export const sourceTagsRelations = relations(sourceTags, ({ many }) => ({
  sourceTagsRelationship: many(sourceTagsRelationship)
}))

export const sourceTagsRelationshipRelations = relations(sourceTagsRelationship, ({ one }) => ({
  source: one(rssSources, {
    fields: [sourceTagsRelationship.sourceId],
    references: [rssSources.id]
  }),
  tag: one(sourceTags, {
    fields: [sourceTagsRelationship.tagId],
    references: [sourceTags.id]
  })
}))

export const summaryRelations = relations(summary, ({ one, many }) => ({
  user: one(users, {
    fields: [summary.userId],
    references: [users.id]
  }),
  links: many(summaryArticles)
}))

export const summaryArticlesRelations = relations(summaryArticles, ({ one }) => ({
  summary: one(summary, {
    fields: [summaryArticles.summaryId],
    references: [summary.id]
  }),
  article: one(articles, {
    fields: [summaryArticles.articleId],
    references: [articles.id]
  })
}))
