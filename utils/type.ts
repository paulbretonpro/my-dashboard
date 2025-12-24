// Workspace
export interface IWorspace {
  id: number
  name: string
  icon?: string
}

// Pages
export interface IPage {
  id: number
  name: string
  isFavorite: boolean
  description?: string
}

export interface IWorspacePage extends IPage {
  worskpaceId: number
}

// Tâches
export interface ITask {
  id: number
  deadline: Date
  content: string
  isDone: boolean
  recall: Date
  pageId: number
}

export interface IPageTask extends ITask {
  pageId: number
}
