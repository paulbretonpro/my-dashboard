import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  providerId: text('provider_id').notNull(),
  displayName: text('display_name'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
})

export const pages = pgTable('pages', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  icon: text('icon'),
  isFavorite: boolean('is_favorite').default(false).notNull(),
  parentId: integer('parent_id').references(() => pages.id, { onDelete: 'cascade' }),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull()
})

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  deadline: timestamp('deadline', { withTimezone: true }),
  isDone: boolean('is_done').default(false),
  recall: timestamp('recall', { withTimezone: true }),
  pageId: integer('page_id').references(() => pages.id, { onDelete: 'cascade' }),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
})
