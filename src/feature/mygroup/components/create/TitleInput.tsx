import type { MeetingsFormData } from "../../types/group";

interface Props {
  setField: <K extends keyof MeetingsFormData>(
    key: K,
    value: MeetingsFormData[K]
  ) => void;
}

function TitleInput({setField}:Props) {
  return (
    <div className="flex flex-col gap-1 ">
      <label htmlFor="groupname">
        모임 이름 <span className="text-red-500 font-semibold">*</span>
      </label>
      <input
        id="groupname"
        type="text"
        required
        placeholder="예시) 제주도여행"
        onChange={(e) => setField('title',e.target.value)}
        className="px-2 py-3 rounded-lg border-lightgray border"
      />
    </div>
  );
}
export default TitleInput