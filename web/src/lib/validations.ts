import { z } from 'zod';

export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const SearchSchema = z.object({
  q: z.string().max(100).optional().default(''),
});

export const FilterPaginationSchema = PaginationSchema.merge(SearchSchema);
export type PaginationParams = z.infer<typeof PaginationSchema>;
export type SearchParams = z.infer<typeof SearchSchema>;
export type FilterPaginationParams = z.infer<typeof FilterPaginationSchema>;