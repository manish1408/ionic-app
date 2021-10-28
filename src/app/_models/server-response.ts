export class ServerResponse<T> {
    data: T;
    success: boolean;
    message: string;
}

export class PagingResponse<T> {
    data: T[];
    success: boolean;
    message: string;
    totalCount: number;
}