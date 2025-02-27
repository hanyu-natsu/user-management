export interface PaginatedResults<T> {
  results: T[];
  total: number;
  page: number;
  limit: number;
}
