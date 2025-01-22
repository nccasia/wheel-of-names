"use server";

import { MezonConstants } from "@/constants/mezonConstants";
import { ActionResponse, MezonUser } from "@/types";
import { StatusCodes } from "http-status-codes";

const getMezonUserAsync = async (accessToken?: string): Promise<ActionResponse> => {
    try {
        if (!accessToken) {
            return {
                statusCodes: StatusCodes.UNAUTHORIZED,
                message: "You must login to Mezon to spin the wheel"
            }
        }
        const response = await fetch(`${process.env.MEZON_API_URL}/v2/account?`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": 'application/json'
            }
        })
        if (!response.ok) {
            return {
                statusCodes: response.status,
                message: "Error fetching user data"
            }
        }
        const json = await response.json()
        const mezonUser = json?.data as MezonUser
        if (!mezonUser) {
            return {
                statusCodes: StatusCodes.INTERNAL_SERVER_ERROR,
                message: "Error fetching user data"
            }
        }
        return {
            statusCodes: StatusCodes.OK,
            data: mezonUser
        }
    }
    catch (error) {
        console.error(error)
        return {
            statusCodes: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Error fetching user data"
        }
    }
}

const verifyUserRoleAsync = async (accessToken?: string): Promise<Boolean> => {
    try {
        if (!accessToken) {
            return false;
        }
        const clanResponse = await fetch(`${process.env.MEZON_API_URL}/v2/clandesc?limit=50&state=1&cursor=&`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": 'application/json'
            }
        })
        if (!clanResponse.ok) {
            return false;
        }
        const json = await clanResponse.json()
        const clanList = json?.data?.clandesc as Array<any>
        if (!json || !clanList || clanList.length === 0) {
            return false;
        }
        const KOMUClan = clanList.find((clan: any) => clan.name === MezonConstants.CLAN_NAME)
        if (!KOMUClan) {
            return false;
        }
        const rolesResponse = await fetch(`${process.env.MEZON_API_URL}/v2/roleuserinclan/${KOMUClan?.id}?`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": 'application/json'
            }
        })
        if (!rolesResponse.ok) {
            return false;
        }
        const rolesJson = await rolesResponse.json()
        const rolesData = rolesJson?.data?.roles as Array<any>
        if (!rolesData || rolesData.length === 0) {
            return false;
        }
        const hasRole = rolesData.some((role: any) => MezonConstants.ALLOW_SPIN_ROLES.includes(role.title))
        return hasRole;
    }
    catch (error) {
        console.error(error)
        return false;
    }
}
export { getMezonUserAsync, verifyUserRoleAsync }