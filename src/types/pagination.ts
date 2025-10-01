export interface PaginatedResult<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}
