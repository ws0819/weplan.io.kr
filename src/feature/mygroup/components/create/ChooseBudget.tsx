import { formatNumber, parseNumber } from "@/shared/utill/formatNumber";
import type { MeetingsFormData } from "../../types/group";

interface Props {
  formData: MeetingsFormData;
  setField: <K extends keyof MeetingsFormData>(
    key: K,
    value: MeetingsFormData[K],
  ) => void;
}

function ChooseBudget({ formData, setField }: Props) {


  return (
    <div className="flex flex-col gap-1 ">
      <label htmlFor="groupname">
        총 예산 등록 <span className="text-red-500 font-semibold">*</span>
      </label>
      <input
        id="groupname"
        type="text"
        value={formatNumber(formData.total_amount)}
        placeholder="예시) 30000"
        onChange={(e) => setField("total_amount", parseNumber(e.target.value))}
        className="px-2 py-3 rounded-lg border-lightgray border"
      />
    </div>
  );
}
export default ChooseBudget