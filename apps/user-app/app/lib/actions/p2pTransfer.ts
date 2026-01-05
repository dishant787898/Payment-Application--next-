"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import db from "@repo/db/client";

export default async function P2PTransfer(UserNumber: number, Amount: number) {
  const session = await getServerSession(authOptions);
  const senderId = Number(session?.user?.id);
  const reciverNum = String(UserNumber);
  if (!senderId) {
    return {
      message: "User not logged in",
    };
  }
  const reciver = await db.user.findFirst({
    where: {
      number: reciverNum,
    },
  });
  if (!reciver) {
    return {
      message: "Reciver not found",
    };
  }
  const reciverId = reciver.id;
  try{
  await db.$transaction(async (tx) => {
    await tx.$queryRaw `SELECT * FROM "Balance" WHERE "userId" = ${senderId} FOR UPDATE`;
    const senderBal = await tx.balance.findFirst({
      where: {
        userId: senderId,
      },
    });
    if (!senderBal || senderBal.amount < Amount) {
      throw new Error("Insufficient Balance");
    }
    await tx.balance.update({
      where: { userId: senderId },
      data: { amount: { decrement: Amount } },
    });
    await tx.balance.update({
      where: { userId: reciverId },
      data: { amount: { increment: Amount } },
    });

    await tx.p2pTransfer.create({
      data:{
        fromUserId: senderId,
        toUserId: reciverId,
        amount: Amount,
        date: new Date(),
      }
    })

  });
  } catch(err){
    return {
        "message": (err as Error).message,
    }
  }
}
