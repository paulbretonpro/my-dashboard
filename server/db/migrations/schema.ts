import { pgTable, foreignKey, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const pages = pgTable("pages", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	isFavorite: boolean("is_favorite").default(false).notNull(),
	workspaceId: integer("workspace_id"),
	userId: integer("user_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "pages_user_id_users_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.workspaceId],
			foreignColumns: [workspaces.id],
			name: "pages_workspace_id_workspaces_id_fk"
		}).onDelete("cascade"),
]);

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	providerId: text("provider_id").notNull(),
	displayName: text("display_name"),
	avatarUrl: text("avatar_url"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const tasks = pgTable("tasks", {
	id: serial().primaryKey().notNull(),
	deadline: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	content: text().notNull(),
	isDone: boolean("is_done").default(false).notNull(),
	recall: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	pageId: integer("page_id").notNull(),
	userId: integer("user_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.pageId],
			foreignColumns: [pages.id],
			name: "tasks_page_id_pages_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "tasks_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const workspaces = pgTable("workspaces", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	icon: text(),
	userId: integer("user_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "workspaces_user_id_users_id_fk"
		}).onDelete("cascade"),
]);
