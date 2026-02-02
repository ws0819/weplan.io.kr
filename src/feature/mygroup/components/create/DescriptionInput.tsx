import type { MeetingsFormData } from "../../types/group";

interface Props {
  setField: <K extends keyof MeetingsFormData>(
    key: K,
    value: MeetingsFormData[K]
  ) => void;
}


function DescriptionInput({ setField } : Props) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="description">모임 설명</label>
      <input
        type="text"
        id="description"
        placeholder="모임 설명을 적어주세요"
        className="px-2 py-3 rounded-lg border-lightgray border"
        onChange={(e)=>setField('description',e.target.value)
        }
      />
    </div>
  );
}
export default DescriptionInput