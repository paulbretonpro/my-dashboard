import { users, tasks, pages } from '~~/server/db/schema'

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Page = typeof pages.$inferSelect
export type PageWithChildren = Page & { children: Page[] }
export type NewPage = typeof pages.$inferInsert

export type Task = typeof tasks.$inferSelect
export type TaskWithPage = typeof tasks.$inferSelect & { page?: Page }
export type NewTask = Omit<typeof tasks.$inferInsert, 'userId'>

export enum AppFetchKeysEnum {
  PAGES = 'pages',
  TASKS = 'tasks'
}

export type TaskFilters = {
  createdAt?: string | Date
  createdBefore?: string | Date
  pageId?: number
  deadline?: string | Date
  sortBy?: 'createdAt' | 'deadline'
  descending?: boolean
  status?: 'all' | 'true' | 'false'
  page?: number
  perPage?: number
  search?: string
}

export type TaskListResponse = {
  data: Task[]
  total: number
}
