import type { Meetings } from "@/feature/mygroup/types/group";
import EditMeetingGroupTitle from "./EditMeetingGroupTitle";
import EditMeetingDescription from "./EditMeetingDescription";
import EditMeetingDate from "./EditMeetingDate";
import EditMeetingThumbnail from "./EditMeetingThumbnail";
import EditMeetingButtonWrap from "./EditMeetingButtonWrap";
import EditAmount from "./EditAmount";

interface Props {
  formData: Meetings;
  setField: <K extends keyof Meetings>(key: K, value: Meetings[K]) => void;
  onClose: () => void;
  onSubmit: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

function EditMeetingForm({formData,setField,onClose,onSubmit}:Props) {
  return (
    <form className="flex flex-col gap-4">
      <EditMeetingGroupTitle formData={formData} setField={setField}/>
      <EditMeetingDescription formData={formData} setField={setField}/>
      <EditMeetingDate formData={formData} setField={setField} />
      <EditAmount formData={formData} setField={setField}/>
      <EditMeetingThumbnail formData={formData} setField={setField}/>
      <EditMeetingButtonWrap onClose={onClose} onSubmit={onSubmit}/>
    </form>
  );
}
export default EditMeetingForm