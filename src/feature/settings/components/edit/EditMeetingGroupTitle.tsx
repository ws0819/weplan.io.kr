import type { Meetings } from "@/feature/mygroup/types/group";

interface Props {
  formData: Meetings;
  setField: <K extends keyof Meetings>(key: K, value: Meetings[K]) => void;
}


function EditMeetingGroupTitle({ formData,setField}:Props) {
  return (
    <div>
      <label htmlFor="title" className="block font-semibold mb-2">
        모임명
      </label>
      <input
        type="text"
        id="title"
        value={formData.title}
        onChange={(e) =>
         setField('title',e.target.value)
        }
        className="w-full border border-border rounded-lg py-3 px-4"
        placeholder="모임 이름을 입력하세요"
      />
    </div>
  );
}
export default EditMeetingGroupTitle;