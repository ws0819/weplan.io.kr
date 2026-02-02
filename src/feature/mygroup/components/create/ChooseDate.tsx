import type { MeetingsFormData } from "../../types/group";

interface Props {
  formData: MeetingsFormData
  setField: <K extends keyof MeetingsFormData>(
    key: K,
    value: MeetingsFormData[K]
  ) => void;
}


function ChooseDate({ formData,setField }:Props) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="date">
        일정 <span className="text-red-500 font-semibold">*</span>
      </label>
      <input
        id="date"
        type="date"
        className="px-2 py-3 rounded-lg border-lightgray border "
        placeholder="시작일"
        min={new Date().toISOString().split("T")[0]}
        onChange={(e) =>setField('startDate',e.target.value)
        }
      />
      <input
        id="end-date"
        type="date"
        min={formData.startDate || new Date().toISOString().split("T")[0]}
        onChange={(e) =>setField('endDate',e.target.value)
        }
        className="px-2 py-3 rounded-lg border-lightgray border"
        placeholder="종료일"
      />
    </div>
  );
}
export default ChooseDate