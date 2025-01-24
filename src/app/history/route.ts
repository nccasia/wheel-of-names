import { prisma } from '@/libs/prisma';
import { ActionResponse, PaginationQuery } from '@/types';
import { StatusCodes } from 'http-status-codes';

const getSpinHistoryAsync = async (query: PaginationQuery): Promise<ActionResponse> => {
  try {
    const totalItem = await prisma.spinHistories.count();
    const spinHistories = await prisma.spinHistories.findMany({
      take: query.limit,
      skip: (query.page - 1) * query.limit,
      orderBy: {
        spinTime: 'desc'
      }
    });
    return {
      statusCodes: StatusCodes.OK,
      data: {
        totalItem,
        totalPages: Math.ceil(totalItem / query.limit),
        currentPage: query.page,
        currentLimit: query.limit,
        currentItems: spinHistories.length,
        items: spinHistories,
      }
    }
  } catch (error) {
    console.error(error);
    return {
      statusCodes: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'An error occurred while getting spin history',
    };
  }
};

export async function POST(request: Request) {
  const body = await request.json();
  console.log(body)
  const spine = body as unknown as PaginationQuery;
  const res = await getSpinHistoryAsync(spine);
  return Response.json(res);
}
