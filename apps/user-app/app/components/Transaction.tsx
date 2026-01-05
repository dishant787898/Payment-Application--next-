import { Card } from "@repo/ui/card"

export default function Transactions(
    {transactions}:{ transactions:{fromUserId: number,
        toUserId: number,
        amount: number,
        date: Date}[]}
){
    if (!transactions.length) {
        return <Card title="Recent Transactions">
            <div className="text-center pb-8 pt-8">
                No Recent transactions
            </div>
        </Card>
    }

    return <div>
        <Card title="Recent Transactions">
      <div className="pt-2">
        {transactions.map((t, index) => (
          <div key={index} className="flex justify-between py-2">
            <div>
              <div className="text-sm">P2P Transfer</div>
              <div className="text-slate-600 text-xs">
                {new Date(t.date).toDateString()}
              </div>
            </div>
            <div className="flex flex-col justify-center">
              - Rs {t.amount / 100}
            </div>
          </div>
        ))}
      </div>
    </Card> 

    </div>

}