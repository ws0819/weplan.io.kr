import { useGetMember } from "@/feature/mygroup/api/useGetMember";
import type { Meetings } from "@/feature/mygroup/types/group";
import { formatNumber } from "@/shared/utill/formatNumber";
import { useParams } from "react-router";

interface Props{
  data:Meetings
}


function BudgetHeader({ data}:Props) {

  const { id } = useParams()
  const { data: member } = useGetMember(id)
  
  const devideBudget = data.totalAmount / member.length

  console.log(data)
  return (
    <header className="flex justify-between items-center">
      <h1 className="font-semibold text-lg">총 예산</h1>
      <span>
        <strong>{formatNumber(data.totalAmount)}원</strong>
        {devideBudget > 0 && (
          <p className="text-sm text-lightgray">1인당 {formatNumber(devideBudget, {round:true})}원</p>
        )}
      </span>
    </header>
  );
}
export default BudgetHeader