import { sweetInfo, sweetSuccess } from "@/shared/utill/swir";
import { usePostBudgetItem } from "../../api/usePostBudgetItem";
import CreateBudgetTitle from "./CreateBudgetTitle";
import useBudgetForm from "../../hooks/useBudgetForm";
import CreateBudgetAmount from "./CreateBudgetAmount";
import CreateBudgetCategory from "./CreateBudgetCategory";
import CreateBudgetButtonWrap from "./CreateBudgetButtonWrap";

interface Props{
  onClose:() => void
}

function AddItem({ onClose }:Props) {
  
  const { formData,setField } = useBudgetForm()
  const { mutate } = usePostBudgetItem()
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      sweetInfo("항목 이름을 입력해주세요.");
      return;
    }

    if (!formData.amount){
      sweetInfo('금액을 입력해주세요.')
      return
    }

    if (formData.category === '') {
      sweetInfo('카테고리를 선택해주세요.')
      return 
    }

    mutate(
      {
        meetingId: formData.meetingId,
        name: formData.name,
        amount: formData.amount,
        category: formData.category
      }, {
        onSuccess: () => {
          sweetSuccess('예산 항목이 추가되었습니다.')
          onClose()
        }
      }
    )
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h1 className="text-xl font-semibold mb-6">예산 항목 추가</h1>

        <form className="flex flex-col gap-4">
          <CreateBudgetTitle formData={formData} setField={setField}/>
          <CreateBudgetAmount formData={formData} setField={setField} />
          <CreateBudgetCategory formData={formData} setField={ setField} />
          <CreateBudgetButtonWrap onClose={onClose} onSubmit={ handleSubmit} />
        </form>
      </div>
    </div>
  );
}
export default AddItem