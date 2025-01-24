import { GameRewards } from '@/constants/gameRewards';
import { checkNewYear } from '@/helpers';
import { prisma } from '@/libs/prisma';
import { ActionResponse, SpinResult, User } from '@/types';
import { StatusCodes } from 'http-status-codes';
import { TimeConstants } from '@/constants/timeConstants';
import { MezonConstants } from '@/constants/mezonConstants';

const spinWheelAsync = async (spine: User): Promise<ActionResponse> => {
  try {
    if (!checkNewYear()) {
      return {
        statusCodes: StatusCodes.BAD_REQUEST,
        message: 'You can only spin the wheel after the Lunar New Year',
      };
    }

    const currentUser = await prisma.users.findFirst({
      where: {
        userId: spine.id,
      },
    });

    if (!currentUser) {
      return {
        statusCodes: StatusCodes.BAD_REQUEST,
        message: 'Please use mezon account to spin the wheel',
      };
    }

    if (
      !currentUser.roles.some((role) =>
        MezonConstants.ALLOW_SPIN_ROLES.includes(role)
      )
    ) {
      return {
        statusCodes: StatusCodes.BAD_REQUEST,
        message: 'You do not have permission to spin the wheel',
      };
    }

    const isSpined = await prisma.spinHistories.findFirst({
      where: {
        userId: currentUser.userId,
      },
    });

    if (isSpined) {
      return {
        statusCodes: StatusCodes.BAD_REQUEST,
        message: 'You have already spinned the wheel',
      };
    }
    // Random reward
    const randomIndex = Math.floor(Math.random() * GameRewards.length);
    const spinResult: SpinResult = {
      reward: GameRewards[randomIndex],
      index: randomIndex,
    };

    const newSpin = await prisma.spinHistories.create({
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
      statusCodes: StatusCodes.OK,
      message: 'You have successfully spinned the wheel',
      data: spinResult,
    };
  } catch (error) {
    console.error(error);
    return {
      statusCodes: StatusCodes.INTERNAL_SERVER_ERROR,
      message: 'An error occurred while spinning the wheel',
    };
  }
};

export async function POST(request: Request) {
  const body = await request.json();
  console.log(body)
  const spine = body as unknown as User;
  const res = await spinWheelAsync(spine);
  return Response.json(res);
}