import type { BudgetItem } from "../../type/budget";

interface Props {
  formData: BudgetItem;
  setField: <K extends keyof BudgetItem>(key: K, value: BudgetItem[K]) => void;
}

function CreateBudgetTitle({ formData,setField}:Props) {
  return (
    <div>
      <label htmlFor="name" className="block font-semibold mb-2">
        항목 이름
      </label>
      <input
        type="text"
        id="name"
        value={formData.name}
        onChange={(e) =>
          setField('name',e.target.value)
        }
        className="w-full border border-border rounded-lg py-3 px-4"
        placeholder="예) 숙소, 식비, 교통비"
        required
      />
    </div>
  );
}
export default CreateBudgetTitle