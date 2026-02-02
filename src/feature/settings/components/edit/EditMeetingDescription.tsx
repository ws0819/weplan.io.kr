import type { Meetings } from "@/feature/mygroup/types/group";

interface Props {
  formData: Meetings;
  setField: <K extends keyof Meetings>(key: K, value: Meetings[K]) => void;
}

function EditMeetingDescription({ formData,setField}:Props) {
  return (
    <div>
      <label htmlFor="description">모임 설명</label>
      <input
        type="text"
        id="description"
        className="w-full border border-border rounded-lg py-3 px-4"
        value={formData.description}
        onChange={(e) => setField("description", e.target.value)}
      />
    </div>
  );
}
export default EditMeetingDescription