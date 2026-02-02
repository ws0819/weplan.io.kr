import { GoPencil } from "react-icons/go";

interface Props{
  onOpen:()=>void
}

function BudgetLeader({ onOpen}:Props) {
  return (
    <div className="flex items-center justify-between mb-2">
      <p className="font-semibold">총무</p>
      <button
        type="button"
        className="flex gap-1 items-center"
        onClick={onOpen}
      >
        <GoPencil size={14} className="text-blue-500" />
        <p className="text-blue-500">변경하기</p>
      </button>
    </div>
  );
}
export default BudgetLeader