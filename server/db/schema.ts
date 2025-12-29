import { boolean, integer, pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  providerId: text('provider_id').notNull(),
  displayName: text('display_name'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export const workspaces = pgTable('workspaces', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  icon: text('icon'),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull()
})

export type Workspace = typeof workspaces.$inferSelect
export type NewWorkspace = typeof workspaces.$inferInsert

export const pages = pgTable('pages', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  isFavorite: boolean('is_favorite').default(false).notNull(),
  description: text('description'),
  workspaceId: integer('workspace_id')
    .references(() => workspaces.id, { onDelete: 'cascade' })
    .notNull()
})

export type Page = typeof pages.$inferSelect
export type NewPage = typeof pages.$inferInsert

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  deadline: timestamp('deadline', { withTimezone: true }).notNull(),
  content: text('content').notNull(),
  isDone: boolean('is_done').default(false).notNull(),
  recall: timestamp('recall', { withTimezone: true }).notNull(),
  pageId: integer('page_id')
    .references(() => pages.id, { onDelete: 'cascade' })
    .notNull(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull()
})

export type Task = typeof tasks.$inferSelect
export type NewTask = typeof tasks.$inferInsert
