import Button from "@/shared/components/button/Button";
import TitleInput from "./TitleInput";
import DescriptionInput from "./DescriptionInput";
import ChooseDate from "./ChooseDate";
import UploadThumbnail from "./UploadThumbnail";
import type { Gradient, MeetingsFormData } from "../../types/group";
import ChooseBudget from "./ChooseBudget";

interface Props {
  formData: MeetingsFormData;
  setField: <K extends keyof MeetingsFormData>(
    key: K,
    value: MeetingsFormData[K]
  ) => void;
  onSubmit: () => void;
  gradient:Gradient
}

function CreateGroupForm({formData,setField,onSubmit}:Props) {

  return (
    <form className="flex flex-col gap-4 mt-5">
      <div className="flex flex-col gap-1">
        <TitleInput setField={setField}/>
        <DescriptionInput setField={setField}/>
      </div>
      <ChooseDate formData={formData} setField={setField} />
      <ChooseBudget formData={ formData} setField={setField} />
      <UploadThumbnail formData={formData} setField={setField} />
      <Button variant="primary" size="lg" onClick={onSubmit}>
        모임 만들기
      </Button>
    </form>
  );
}
export default CreateGroupForm