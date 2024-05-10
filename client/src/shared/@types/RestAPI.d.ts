export namespace RestAPIData {
  export type Pagination<T> = {
    results: T[];
    page: number;
    total_pages: number;
  };
}
