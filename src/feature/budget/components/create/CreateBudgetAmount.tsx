import type { BudgetItem } from "../../type/budget";

interface Props {
  formData: BudgetItem;
  setField: <K extends keyof BudgetItem>(key: K, value: BudgetItem[K]) => void;
}

function CreateBudgetAmount({ formData,setField}:Props) {
  return (
    <div>
      <label htmlFor="amount" className="block font-semibold mb-2">
        금액 (원)
      </label>
      <input
        type="number"
        id="amount"
        value={formData.amount || ""}
        onChange={(e) =>
          setField('amount',parseInt(e.target.value))
        }
        className="w-full border border-border rounded-lg py-3 px-4"
        placeholder="예) 300000"
        min="0"
        required
      />
    </div>
  );
}
export default CreateBudgetAmount