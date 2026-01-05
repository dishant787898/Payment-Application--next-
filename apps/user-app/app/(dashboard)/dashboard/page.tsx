import prisma from "@repo/db/client";
import { Card } from "@repo/ui/card";
import { getServerSession } from "next-auth";
import { BalanceCard } from "../../components/BalanceCard";
import { authOptions } from "../../lib/auth";

async function getBalance() {
    const session = await getServerSession(authOptions);
    const balance = await prisma.balance.findFirst({
        where: {
            userId: Number(session?.user?.id),
        },
    });
    return {
        amount: balance?.amount || 0,
        locked: balance?.locked || 0,
    };
}

async function getRecentTransactions() {
    const session = await getServerSession(authOptions);
    const userId = Number(session?.user?.id);

    if (!userId) {
        return { totalSent: 0, totalReceived: 0, sentCount: 0, receivedCount: 0, recentTxns: [] };
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
        },
        take: 5
    });

    const sent = txn.filter(t => t.fromUserId === userId);
    const received = txn.filter(t => t.toUserId === userId);

    const totalSent = sent.reduce((acc, t) => acc + t.amount, 0);
    const totalReceived = received.reduce((acc, t) => acc + t.amount, 0);

    return { 
        totalSent, 
        totalReceived, 
        sentCount: sent.length, 
        receivedCount: received.length,
        recentTxns: txn.slice(0, 5)
    };
}

export default async function DashboardPage() {
    const balance = await getBalance();
    const { totalSent, totalReceived, sentCount, receivedCount, recentTxns } = await getRecentTransactions();

    return (
        <div className="w-full p-4">
            <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
                Dashboard
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                    <BalanceCard amount={balance.amount} locked={balance.locked} />
                </div>
                
                <div>
                    <Card title="Money Sent">
                        <div className="text-center py-4">
                            <div className="text-3xl font-bold text-red-500">
                                ₹{totalSent / 100}
                            </div>
                            <div className="text-slate-500 text-sm mt-2">
                                {sentCount} transaction(s)
                            </div>
                        </div>
                    </Card>
                </div>
                
                <div>
                    <Card title="Money Received">
                        <div className="text-center py-4">
                            <div className="text-3xl font-bold text-green-500">
                                ₹{totalReceived / 100}
                            </div>
                            <div className="text-slate-500 text-sm mt-2">
                                {receivedCount} transaction(s)
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Recent Transactions */}
            <div>
                <Card title="Recent Transactions">
                    <div>
                        {recentTxns.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No recent transactions
                            </div>
                        ) : (
                            recentTxns.map((t, index) => {
                                const isSent = t.fromUserId === Number(balance.amount > 0 ? t.fromUserId : 0);
                                return (
                                    <div key={index} className="flex justify-between py-3 border-b border-slate-200 last:border-0">
                                        <div>
                                            <div className="text-sm font-medium">
                                                P2P Transfer
                                            </div>
                                            <div className="text-slate-500 text-xs">
                                                {new Date(t.date).toLocaleDateString()} • {new Date(t.date).toLocaleTimeString()}
                                            </div>
                                        </div>
                                        <div className="flex items-center font-semibold">
                                            ₹{t.amount / 100}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}