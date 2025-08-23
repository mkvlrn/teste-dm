export class PaginatedResult<T> {
  totalItems: number;
  totalPages: number;
  page: number;
  limit: number;
  data: T[];

  constructor(totalItems: number, limit: number, page: number, data: T[]) {
    this.totalItems = totalItems;
    this.totalPages = Math.ceil(totalItems / limit);
    this.page = page;
    this.limit = limit;
    this.data = data;
  }
}
