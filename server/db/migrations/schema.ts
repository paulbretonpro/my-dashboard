import { pgTable, foreignKey, serial, text, boolean, integer, timestamp } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const pages = pgTable(
  'pages',
  {
    id: serial().primaryKey().notNull(),
    name: text().notNull(),
    icon: text(),
    isFavorite: boolean('is_favorite').default(false).notNull(),
    parentId: integer('parent_id'),
    userId: integer('user_id').notNull()
  },
  (table) => [
    foreignKey({
      columns: [table.parentId],
      foreignColumns: [table.id],
      name: 'pages_parent_id_pages_id_fk'
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'pages_user_id_users_id_fk'
    }).onDelete('cascade')
  ]
)

export const users = pgTable('users', {
  id: serial().primaryKey().notNull(),
  providerId: text('provider_id').notNull(),
  displayName: text('display_name'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull()
})

export const tasks = pgTable(
  'tasks',
  {
    id: serial().primaryKey().notNull(),
    deadline: timestamp({ withTimezone: true, mode: 'string' }),
    content: text().notNull(),
    isDone: boolean('is_done').default(false),
    recall: timestamp({ withTimezone: true, mode: 'string' }),
    pageId: integer('page_id'),
    userId: integer('user_id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull()
  },
  (table) => [
    foreignKey({
      columns: [table.pageId],
      foreignColumns: [pages.id],
      name: 'tasks_page_id_pages_id_fk'
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: 'tasks_user_id_users_id_fk'
    }).onDelete('cascade')
  ]
)
