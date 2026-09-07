export type ColumnsCount = '3' | '5';

export type SearchParams = {
    page?: number;
    per_page?: number;
    columns?: ColumnsCount;
    query?: string;
}