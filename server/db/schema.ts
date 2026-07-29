import {
  boolean,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uuid
} from 'drizzle-orm/pg-core'
import { RssFieldMapping } from '~~/shared/types'

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull(),
  name: text('name'),
  avatarUrl: text('avatar_url'),
  lastConnection: timestamp('last_connection', { withTimezone: true }),
  previousConnection: timestamp('previous_connection', { withTimezone: true }),
  createdAt: timestamp('created_at').defaultNow()
})

export const pages = pgTable('pages', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  icon: text('icon'),
  isFavorite: boolean('is_favorite').default(false).notNull(),
  parentId: integer('parent_id').references(() => pages.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull()
})

export const taskTags = pgTable('task_tags', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  color: text('color').default('#3b82f6').notNull(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
})

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content'),
  status: text('status').default('todo').notNull(), // 'todo', 'pending', 'done'
  deadline: timestamp('deadline', { withTimezone: true }),
  tagId: integer('tag_id').references(() => taskTags.id, { onDelete: 'set null' }),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
})

export const sourceTypes = pgTable('source_types', {
  id: serial('id').primaryKey(),
  label: text('label').notNull().unique()
})

export const sourceTags = pgTable('source_tags', {
  id: serial('id').primaryKey(),
  label: text('label').notNull().unique()
})

export const rssSources = pgTable('rss_sources', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  url: text('url').notNull().unique(),
  siteUrl: text('site_url'),
  isActive: boolean('is_active').default(true).notNull(),
  lastFetchedAt: timestamp('last_fetched_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  fieldMapping: jsonb('field_mapping').$type<RssFieldMapping>(),
  sourceTypeId: integer('source_type_id').references(() => sourceTypes.id, { onDelete: 'set null' })
})

export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  link: text('link').notNull().unique(),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  sourceId: integer('source_id')
    .references(() => rssSources.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
})

export const userSources = pgTable(
  'user_sources',
  {
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    rssSourceId: integer('rss_source_id')
      .references(() => rssSources.id, { onDelete: 'cascade' })
      .notNull()
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.rssSourceId] })
  })
)

export const userArticles = pgTable(
  'user_articles',
  {
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    articleId: integer('article_id')
      .references(() => articles.id, { onDelete: 'cascade' })
      .notNull(),
    isRead: boolean('is_read').default(false).notNull(),
    isFavorite: boolean('is_favorite').default(false).notNull()
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.articleId] })
  })
)

export const sourceTagsRelationship = pgTable(
  'source_tags_relationship',
  {
    sourceId: integer('source_id')
      .references(() => rssSources.id, { onDelete: 'cascade' })
      .notNull(),
    tagId: integer('tag_id')
      .references(() => sourceTags.id, { onDelete: 'cascade' })
      .notNull()
  },
  (table) => ({
    pk: primaryKey({ columns: [table.sourceId, table.tagId] })
  })
)

export const summary = pgTable('summary', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull()
})

export const summaryArticles = pgTable('summary_articles', {
  id: serial('id').primaryKey(),
  summaryId: integer('summary_id')
    .references(() => summary.id, { onDelete: 'cascade' })
    .notNull(),
  articleId: integer('article_id').references(() => articles.id, { onDelete: 'cascade' }),
  url: text('url').notNull()
})

export const notes = pgTable('notes', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  title: text('title').notNull(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull()
})

export const userGithubRepositories = pgTable('user_github_repositories', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  owner: text('owner').notNull(),
  repo: text('repo').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
})
