"use server";

import { GameRewards } from "@/constants/gameRewards";
import { checkNewYear } from "@/helpers";
import { prisma } from "@/libs/prisma";
import { ActionResponse, MezonUser, SpinResult, User } from "@/types";
import { StatusCodes } from "http-status-codes";
import { getMezonUserAsync, verifyUserRoleAsync } from "./auth";
import { TimeConstants } from "@/constants/timeConstants";

const spinWheelAsync = async (accessToken?: string) : Promise<ActionResponse> => {
    try {
        if (!checkNewYear()) {
            return {
                statusCodes: StatusCodes.BAD_REQUEST,
                message: "You can only spin the wheel after the Lunar New Year"
            }
        }
        const res = await getMezonUserAsync(accessToken);
        if (res.statusCodes !== StatusCodes.OK) {
            return res;
        }
        const isValidRole = await verifyUserRoleAsync(accessToken);
        if (!isValidRole) {
            return {
                statusCodes: StatusCodes.FORBIDDEN,
                message: "You do not have the required role to spin the wheel"
            }
        }
        
        const mezonUser = res.data as MezonUser;

        const isSpined = await prisma.spinHistory.findFirst({
            where: {
                userId: mezonUser.user.id
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
                userId: mezonUser.user.id,
                userName: mezonUser.user.username,
                rewardValue: Number(spinResult.reward?.value) || 0,
            }
        });

        setTimeout(() => {
            const reward = GameRewards[randomIndex];
            // TODO: CALL KOMU BOT TO SEND TOKEN TO USER
        }, TimeConstants.SPIN_TIME);

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
    getSpinHistoryAsync, spinWheelAsync,
};

