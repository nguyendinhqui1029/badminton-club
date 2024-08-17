export interface ApiResponseValue<T> {
    statusCode: number;
    statusText: string;
    totalCount: number;
    page: number;
    data: T;
}