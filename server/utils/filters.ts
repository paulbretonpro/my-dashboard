import { SQL } from 'drizzle-orm'

export const isValidDate = (date?: Date) => date instanceof Date && !Number.isNaN(date.getTime())

export const parseDate = (value?: unknown) => {
  if (!value) return undefined
  if (value instanceof Date) return isValidDate(value) ? value : undefined
  const date = new Date(String(value))
  return isValidDate(date) ? date : undefined
}

export const parseBoolean = (value?: unknown): boolean | undefined => {
  if (value === 'true' || value === '1') return true
  if (value === 'false' || value === '0') return false
  return undefined
}

export const getPagination = (query: { page?: number; perPage?: number }) => {
  const page = Number(query.page) || 1
  const perPage = Number(query.perPage) || 10

  const limit = perPage > 0 ? perPage : 10
  const currentPage = page > 0 ? page : 1
  const offset = (currentPage - 1) * limit

  return { limit, offset }
}
