import type { Meetings } from "@/feature/mygroup/types/group";

interface Props {
  formData: Meetings;
  setField: <K extends keyof Meetings>(key: K, value: Meetings[K]) => void;
}

function EditMeetingDate({ formData,setField}:Props) {
  return (
    <>
      <div>
        <label htmlFor="startDate" className="block font-semibold mb-2">
          시작일
        </label>
        <input
          type="date"
          id="startDate"
          min={new Date().toISOString().split("T")[0]}
          value={formData.startDate}
          onChange={(e) =>
            setField('startDate',e.target.value)
          }
          className="w-full border border-border rounded-lg py-3 px-4"
        />
      </div>

      {/* 종료일 */}
      <div>
        <label htmlFor="endDate" className="block font-semibold mb-2">
          종료일
        </label>
        <input
          type="date"
          id="endDate"
          min={formData.startDate || new Date().toISOString().split("T")[0]}
          value={formData.endDate}
          onChange={(e) =>
            setField('endDate',e.target.value)
          }
          className="w-full border border-border rounded-lg py-3 px-4"
        />
      </div>
    </>
  );
}
export default EditMeetingDate