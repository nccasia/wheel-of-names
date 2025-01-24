import { Pagination } from "@/constants/Pagination";

export type User = {
    id: string;
    name: string;
    userName: string;
};

export type SpinResult = {
    reward: any;
    index: number;
};
export interface History {
    id: string;
    userId: string;
    userName: string;
    rewardValue: number;
    spinTime: Date;
}

export class PaginationQuery {
    page: number = Pagination.DEFAULT_PAGE;
    limit: number = Pagination.DEFAULT_LIMIT;
};