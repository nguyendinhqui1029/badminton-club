export interface ApiResponseValue<T> {
    statusCode: number;
    statusText: string;
    totalCount: number;
    page: number;
    data: T | null;
}

export interface ErrorResponse {
    message: string; translateKey: string
}