import type { Meetings } from "@/feature/mygroup/types/group";
import { formatNumber, parseNumber } from "@/shared/utill/formatNumber";

interface Props {
  formData: Meetings;
  setField: <K extends keyof Meetings>(key: K, value: Meetings[K]) => void;
}


function EditAmount({ formData,setField}:Props) {
  return (
    <div>
      <label htmlFor="title" className="block font-semibold mb-2">
        총예산
      </label>
      <input
        type="text"
        id="title"
        value={formatNumber(formData.totalAmount)}
        onChange={(e) => setField("totalAmount", parseNumber(e.target.value))}
        className="w-full border border-border rounded-lg py-3 px-4"
        placeholder="모임 이름을 입력하세요"
      />
    </div>
  );
}
export default EditAmount