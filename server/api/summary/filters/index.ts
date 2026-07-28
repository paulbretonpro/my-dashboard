import z from 'zod'

export const summaryFiltersSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  perPage: z.coerce.number().int().positive().optional()
})

export type SummaryFilters = z.infer<typeof summaryFiltersSchema>
