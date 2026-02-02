import { useState } from "react";
import BudgetCopyButton from "./BudgetCopyButton";
import BudgetLeader from "./BudgetLeader";
import BudgetLeaderImage from "./BudgetLeaderImage";
import type { Leader } from "../../type/budget";

interface Props{
  leader:Leader
  onOpen:()=>void
}

function BudgetLeaderCard({ leader, onOpen }: Props) {
 
    const [copy, setCopy] = useState(false);
    const handleCopy = () => {
      setCopy(true);
      navigator.clipboard.writeText(leader.acount);
  };
  
  return (
    <section className="my-4 px-6 py-4 flex flex-col gap-3 bg-white rounded-lg">
      <div>
        <BudgetLeader onOpen={onOpen} />
        <BudgetLeaderImage userId={leader.userId} />
      </div>

      <div>
        <p className="font-semibold">계좌번호</p>
        <div className="flex items-center gap-2 bg-gray-50 p-4">
          <div className="flex-1 rounded-lg p-4">
            <div className="text-sm">{leader.bank}</div>
            <div>{leader.acount}</div>
          </div>
          <BudgetCopyButton copy={copy} onCopy={() => handleCopy()} />
        </div>
      </div>
    </section>
  );
}
export default BudgetLeaderCard