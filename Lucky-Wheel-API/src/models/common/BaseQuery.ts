import { Pagination } from "@/constants/Pagination";


/**
 * @swagger
 * components:
 *   schemas:
 *     PaginationQuery:
 *       type: object
 *       properties:
 *         page:
 *           type: number
 *           description: page number
 *         limit:
 *           type: number
 *           description: number of items per page
 *       example:
 *         page: 1
 *         limit: 10
 */
export class BaseQuery {
    public page: number = Pagination.DEFAULT_PAGE;
    public limit: number = Pagination.DEFAULT_LIMIT;
}