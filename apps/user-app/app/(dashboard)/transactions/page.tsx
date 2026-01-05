import prisma from "@repo/db/client";
import { Card } from "@repo/ui/card";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

async function getTransactionData() {
    const session = await getServerSession(authOptions);
    const userId = Number(session?.user?.id);

    if (!userId) {
        return { sent: [], received: [] };
    }

    const txn = await prisma.p2pTransfer.findMany({
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

    return { sent, received };
}

export default async function TransactionsPage() {
    const { sent, received } = await getTransactionData();

    return (
        <div className="w-full p-4">
            <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
                Transaction History
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Debited / Money Sent */}
                <div>
                    <Card title="Money Sent (Debited)">
                        <div className="max-h-96 overflow-y-auto">
                            {sent.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No transactions yet
                                </div>
                            ) : (
                                sent.map((t, index) => (
                                    <div key={index} className="flex justify-between py-3 border-b border-slate-200 last:border-0">
                                        <div>
                                            <div className="text-sm font-medium">Sent to User #{t.toUserId}</div>
                                            <div className="text-slate-500 text-xs">
                                                {new Date(t.date).toLocaleDateString()} • {new Date(t.date).toLocaleTimeString()}
                                            </div>
                                        </div>
                                        <div className="flex items-center text-red-500 font-semibold">
                                            - ₹{t.amount / 100}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>

                {/* Credited / Money Received */}
                <div>
                    <Card title="Money Received (Credited)">
                        <div className="max-h-96 overflow-y-auto">
                            {received.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No transactions yet
                                </div>
                            ) : (
                                received.map((t, index) => (
                                    <div key={index} className="flex justify-between py-3 border-b border-slate-200 last:border-0">
                                        <div>
                                            <div className="text-sm font-medium">Received from User #{t.fromUserId}</div>
                                            <div className="text-slate-500 text-xs">
                                                {new Date(t.date).toLocaleDateString()} • {new Date(t.date).toLocaleTimeString()}
                                            </div>
                                        </div>
                                        <div className="flex items-center text-green-500 font-semibold">
                                            + ₹{t.amount / 100}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}