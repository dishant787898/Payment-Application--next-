"use server";
import db from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export async function getP2PTransactions() {
  const session = await getServerSession(authOptions);
  const userId = Number(session?.user?.id);
  
  if (!userId) {
    return { sent: [], received: [], userId: 0 };
  }

  const txn = await db.p2pTransfer.findMany({
    where: {
      OR: [
        { fromUserId: userId },
        { toUserId: userId }
      ]
    },
    orderBy: {
      date: 'desc'
    }
  });

  const sent = txn.filter(t => t.fromUserId === userId).map(t => ({
    toUserId: t.toUserId,
    amount: t.amount,
    date: t.date,
  }));

  const received = txn.filter(t => t.toUserId === userId).map(t => ({
    fromUserId: t.fromUserId,
    amount: t.amount,
    date: t.date,
  }));

  return { sent, received, userId };
}
