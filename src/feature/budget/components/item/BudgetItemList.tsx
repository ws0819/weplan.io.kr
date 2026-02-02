import { FaRegTrashCan } from "react-icons/fa6";
import { useUDBudget } from "../../api/useUDBudget";
import { sweetDelete } from "@/shared/utill/swir";

interface Props{
  id: string;
  category: string;
  name: string;
  amount: number,
  meetingId:string
}

function BudgetItemList({ id,category, name, amount, meetingId }: Props) {
  
    const { mutate } = useUDBudget();
    const handleDelete = () => {
      sweetDelete(() => {
        mutate({
          meeting_id: meetingId,
          id,
          op: "d",
        });
      });
    };
  return (
    <>
      <div>
        <p className="text-sm text-lightgray">{category}</p>
        <p className="font-semibold">{name}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-primary font-semibold">{amount}</span>
        <button type="button" aria-label="삭제">
          <FaRegTrashCan size={24} onClick={handleDelete} />
        </button>
      </div>
    </>
  );
}
export default BudgetItemList