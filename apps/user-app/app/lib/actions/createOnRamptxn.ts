"use server";
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export default async function createOnRampTransaction(amount:number, provider :string) {
    const session = await getServerSession(authOptions);
    const token = Math.random().toString(36).substring(2);
    const userId = Number(session?.user?.id);
    if(!userId){
        return{ 
            "message":"User not logged in",
        }
    }
    await prisma.onRampTransaction.create({
    data :{
        userId,
        amount,
        provider,
        status: "Processing",
        startTime: new Date(),
        token:token

    }
    })
    return {
        "message":"Transaction Created",
    }
}