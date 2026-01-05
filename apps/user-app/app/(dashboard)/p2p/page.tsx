"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { TextInput } from "@repo/ui/textinput";
import { useEffect, useState } from "react";
import { getP2PTransactions } from "../../lib/actions/getP2PTransactions";
import P2PTransfer from "../../lib/actions/p2pTransfer";

type SentTransaction = {
    toUserId: number;
    amount: number;
    date: Date;
};

type ReceivedTransaction = {
    fromUserId: number;
    amount: number;
    date: Date;
};

export default function P2PPage() {
    const [amount, setAmount] = useState(0);
    const [number, setNumber] = useState("");
    const [sent, setSent] = useState<SentTransaction[]>([]);
    const [received, setReceived] = useState<ReceivedTransaction[]>([]);
    const [message, setMessage] = useState("");

    async function fetchTransactions() {
        const data = await getP2PTransactions();
        setSent(data.sent);
        setReceived(data.received);
    }

    useEffect(() => {
        fetchTransactions();
    }, []);

    return (
        <div className="w-full p-4">
            <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
                P2P Transfer
            </div>
            
            {message && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <Card title="Send Money">
                        <div className="min-w-72 pt-2">
                            <TextInput label={"Recipient Number"} placeholder={"Enter phone number"} onChange={(value) => {
                                setNumber(value)
                            }} />
                            <TextInput label={"Amount (Rs)"} placeholder={"Enter amount"} onChange={(value) => {
                                setAmount(Number(value))
                            }} />
                            <div className="pt-4 flex justify-center">
                                <Button onClick={async () => {
                                    setMessage("");
                                    const result = await P2PTransfer(Number(number), amount * 100);
                                    if (result?.message) {
                                        setMessage(result.message);
                                    }
                                    await fetchTransactions();
                                }}>Transfer</Button>
                            </div>
                        </div>
                    </Card>
                </div>
                
                {/* Sent Transactions */}
                <div>
                    <Card title="Money Sent">
                        <div className="max-h-64 overflow-y-auto">
                            {sent.length === 0 ? (
                                <div className="text-center py-4 text-gray-500 text-sm">
                                    No sent transactions
                                </div>
                            ) : (
                                sent.map((t, index) => (
                                    <div key={index} className="flex justify-between py-2 border-b border-slate-200 last:border-0">
                                        <div>
                                            <div className="text-xs text-slate-600">To User #{t.toUserId}</div>
                                            <div className="text-xs text-slate-400">
                                                {new Date(t.date).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="text-red-500 font-medium text-sm">
                                            -₹{t.amount / 100}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>

                {/* Received Transactions */}
                <div>
                    <Card title="Money Received">
                        <div className="max-h-64 overflow-y-auto">
                            {received.length === 0 ? (
                                <div className="text-center py-4 text-gray-500 text-sm">
                                    No received transactions
                                </div>
                            ) : (
                                received.map((t, index) => (
                                    <div key={index} className="flex justify-between py-2 border-b border-slate-200 last:border-0">
                                        <div>
                                            <div className="text-xs text-slate-600">From User #{t.fromUserId}</div>
                                            <div className="text-xs text-slate-400">
                                                {new Date(t.date).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="text-green-500 font-medium text-sm">
                                            +₹{t.amount / 100}
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