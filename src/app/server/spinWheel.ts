"use server";

import { GameRewards } from "@/constants/gameRewards";
import { checkNewYear } from "@/helpers";
import { prisma } from "@/libs/prisma";
import { ActionResponse, SpinResult, User } from "@/types";
import { StatusCodes } from "http-status-codes";

const spinWheelAsync = async (spine: User) : Promise<ActionResponse> => {
    try {
        if (!checkNewYear()) {
            return {
                statusCodes: StatusCodes.BAD_REQUEST,
                message: "You can only spin the wheel after the Lunar New Year"
            }
        }
        if (!spine) {
            return {
                statusCodes: StatusCodes.BAD_REQUEST,
                message: "You must login to Mezon to spin the wheel"
            }
        }
        const isSpined = await prisma.spinHistory.findFirst({
            where: {
                userId: spine.id
            }
        });
        if (isSpined) {
            return {
                statusCodes: StatusCodes.BAD_REQUEST,
                message: "You have already spinned the wheel"
            }
        }
        // Random reward
        const randomIndex = Math.floor(Math.random() * GameRewards.length);
        const spinResult: SpinResult = {
            reward: GameRewards[randomIndex],
            index: randomIndex
        };
      
        await prisma.spinHistory.create({
            data: {
                userId: spine.id,
                userName: spine.userName,
                rewardValue: Number(spinResult.reward?.value) || 0,
            }
        });
        return {
            statusCodes: StatusCodes.OK,
            message: "You have successfully spinned the wheel",
            data: spinResult
        }
    }
    catch (error) {
        console.error(error);
        return {
            statusCodes: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "An error occurred while spinning the wheel"
        }
    }
};

const getSpinHistoryAsync = async (currentCursor?: string): Promise<ActionResponse> => {
    try {
        const spinHistories = await prisma.spinHistory.findMany({
            take: 5,
            ...(currentCursor && {
                skip: 1, // Do not include the cursor itself in the query result.
                cursor: {
                    id: currentCursor as string,
                }
            }),
            orderBy: {
                spinTime: 'desc'
            }
        });
        return {
            statusCodes: StatusCodes.OK,
            data: {
                items: spinHistories,
                hasNext: spinHistories?.length > 0,
                nextCursor: spinHistories?.length > 0 ? spinHistories[spinHistories.length - 1].id : null
            }
        }
    }
    catch (error) {
        console.error(error);
        return {
            statusCodes: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "An error occurred while getting spin history"
        }
    }
}
export {
    getSpinHistoryAsync, spinWheelAsync
};

