import { BaseQuery } from "@/models/common/BaseQuery";
import { PaginationQuery, User } from "@/types/common";

export interface IGameService {
    spinWheelAsync(spine: User): Promise<ServiceResponse>;
    getSpinHistoryAsync (query: BaseQuery): Promise<ServiceResponse>
}
