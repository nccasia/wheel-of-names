import { GameRewards } from '@/constants/gameRewards';
import { MezonConstants } from '@/constants/mezonConstants';
import { TimeConstants } from '@/constants/timeConstants';
import { BaseQuery } from '@/models/common/BaseQuery';
import { PrismaService } from '@/services';
import { PaginationQuery, SpinResult, User } from '@/types/common';
import { checkNewYear } from '@/utils';
import { IGameService } from '@interfaces/IGameService';
import { StatusCodes } from 'http-status-codes';

class GameService implements IGameService {

    private _context: PrismaService;

    constructor(PrismaService: PrismaService) {
        this._context = PrismaService;
    }

    public async spinWheelAsync(spine: User): Promise<ServiceResponse> {
        try {
            if (!checkNewYear()) {
                return {
                    statusCode: StatusCodes.BAD_REQUEST,
                    isSuccess: false,
                    errorMessage: 'You can only spin the wheel after the Lunar New Year',
                };
            }

            const currentUser = await this._context.users.findFirst({
                where: {
                    userId: spine.id,
                },
            });

            if (!currentUser) {
                return {
                    statusCode: StatusCodes.BAD_REQUEST,
                    isSuccess: false,
                    errorMessage: 'Please use mezon account to spin the wheel',
                };
            }

            if (
                !currentUser.roles.some((role) =>
                    MezonConstants.ALLOW_SPIN_ROLES.includes(role)
                )
            ) {
                return {
                    statusCode: StatusCodes.BAD_REQUEST,
                    isSuccess: false,
                    errorMessage: 'You do not have permission to spin the wheel',
                };
            }

            const isSpined = await this._context.spinHistories.findFirst({
                where: {
                    userId: currentUser.userId,
                },
            });

            if (isSpined) {
                return {
                    statusCode: StatusCodes.BAD_REQUEST,
                    isSuccess: false,
                    errorMessage: 'You have already spinned the wheel',
                };
            }
            // Random reward
            const randomIndex = Math.floor(Math.random() * GameRewards.length);
            const spinResult: SpinResult = {
                reward: GameRewards[randomIndex],
                index: randomIndex,
            };

            const newSpin = await this._context.spinHistories.create({
                data: {
                    userId: currentUser.userId,
                    userName: currentUser.userName,
                    rewardValue: Number(spinResult.reward?.value) || 0,
                },
            });

            setTimeout(() => {
                const reward = GameRewards[randomIndex];
                // TODO: CALL KOMU BOT TO SEND TOKEN TO USER
                console.log('Send token to user: ', currentUser.userId);
                console.log('Send reward: ', reward);
                fetch(`${process.env.BOT_API_URL}/sendTokenToUser`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Secret-Key': process.env.SEND_TOKEN_KEY!,
                    },
                    body: JSON.stringify({
                        sessionId: newSpin.id,
                        userReceiverList: [
                            {
                                userId: currentUser.userId,
                                amount: reward.value,
                            },
                        ],
                    }),
                });
            }, TimeConstants.SPIN_TIME);

            return {
                statusCode: StatusCodes.OK,
                isSuccess: true,
                data: spinResult,
            };
        } catch (error) {
            console.error(error);
            return {
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                errorMessage: 'An error occurred while spinning the wheel',
            };
        }
    };
    public async getSpinHistoryAsync (query: BaseQuery): Promise<ServiceResponse> {
        try {
            const totalItem = await this._context.spinHistories.count();
            const spinHistories = await this._context.spinHistories.findMany({
                take: Number(query.limit),
                skip: (query.page - 1) * Number(query.limit),
                orderBy: {
                    spinTime: 'desc'
                }
            });
            return {
                statusCode: StatusCodes.OK,
                isSuccess: true,
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
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                isSuccess: false,
                errorMessage: 'An error occurred while getting spin history',
            };
        }
    };
    z
}

export default GameService;