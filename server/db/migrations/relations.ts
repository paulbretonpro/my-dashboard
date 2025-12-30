import { relations } from "drizzle-orm/relations";
import { users, pages, workspaces, tasks } from "./schema";

export const pagesRelations = relations(pages, ({one, many}) => ({
	user: one(users, {
		fields: [pages.userId],
		references: [users.id]
	}),
	workspace: one(workspaces, {
		fields: [pages.workspaceId],
		references: [workspaces.id]
	}),
	tasks: many(tasks),
}));

export const usersRelations = relations(users, ({many}) => ({
	pages: many(pages),
	tasks: many(tasks),
	workspaces: many(workspaces),
}));

export const workspacesRelations = relations(workspaces, ({one, many}) => ({
	pages: many(pages),
	user: one(users, {
		fields: [workspaces.userId],
		references: [users.id]
	}),
}));

export const tasksRelations = relations(tasks, ({one}) => ({
	page: one(pages, {
		fields: [tasks.pageId],
		references: [pages.id]
	}),
	user: one(users, {
		fields: [tasks.userId],
		references: [users.id]
	}),
}));