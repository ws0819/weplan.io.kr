import type { BudgetItem } from "../../type/budget";

interface Props {
  formData: BudgetItem;
  setField: <K extends keyof BudgetItem>(key: K, value: BudgetItem[K]) => void;
}


function CreateBudgetCategory({ formData,setField}:Props) {
  return (
    <div>
      <label htmlFor="category" className="block font-semibold mb-2">
        카테고리
      </label>
      <select
        id="category"
        value={formData.category}
        onChange={(e) =>
          setField('category',e.target.value)
        }
        className="w-full border border-border rounded-lg py-3 px-4"
      >
        <option value="" disabled>카테고리를 선택해주세요.</option>
        <option value="숙소">숙소</option>
        <option value="식비">식비</option>
        <option value="교통비">교통비</option>
        <option value="활동비">활동비</option>
        <option value="쇼핑">쇼핑</option>
        <option value="기타">기타</option>
      </select>
    </div>
  );
}
export default CreateBudgetCategory