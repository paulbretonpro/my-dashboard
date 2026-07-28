import { users, tasks, pages, rssSources, articles, summary, notes } from '~~/server/db/schema'

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Page = typeof pages.$inferSelect
export type PageWithChildren = Page & { children: Page[] }
export type NewPage = typeof pages.$inferInsert

export type Task = typeof tasks.$inferSelect
export type TaskWithPage = Task
export type NewTask = Omit<typeof tasks.$inferInsert, 'userId'>

export type RssSource = typeof rssSources.$inferSelect
export type NewRssSource = typeof rssSources.$inferInsert

export type Articles = typeof articles.$inferSelect
export type ArticlesWithSource = typeof articles.$inferSelect & { source: RssSource }

export type Summary = typeof summary.$inferSelect
export type NewSummary = typeof summary.$inferInsert & { title?: string, content?: string, articleId?: number, url?: string }
export type SummaryWithLinks = Summary & { links: string[] }

export type Note = typeof notes.$inferSelect
export type NewNote = typeof notes.$inferInsert

export enum AppFetchKeysEnum {
  PAGES = 'pages',
  TASKS = 'tasks'
}

export interface RssFieldMapping {
  title?: string
  link?: string
  published?: string
}

export type TaskFilters = {
  createdAt?: string | Date
  createdBefore?: string | Date
  deadline?: string | Date
  deadlineFilter?: 'no-deadline' | 'overdue' | 'today' | 'this-week' | 'this-month'
  descending?: boolean
  page?: number
  perPage?: number
  search?: string
  sortBy?: TaskSortByEnum
  status?: 'all' | 'todo' | 'pending' | 'done'
}

export enum TaskSortByEnum {
  DEADLINE = 'deadline',
  STATUS = 'status',
  CREATED_AT = 'created_at'
}

export type TaskListResponse = {
  data: TaskWithPage[]
  total: number
}

export type Pagination = {
  page: number
  perPage: number
}

export type PaginatedResponse<T> = {
  data: T[]
  total: number
}

export interface CountArticleBySourceType {
  id: number
  label: string
  count: number
}
