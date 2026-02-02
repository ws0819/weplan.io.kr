import type { LinkCard } from "@/feature/schdule/types/link";
import EditLinkCategory from "./EditLinkCategory";
import EditLinkRating from "./EditLinkRating";
import EditLinkMemo from "./EditLinkMemo";
import EditLinkButtonWrap from "./EditLinkButtonWrap";

interface Props {
  formData: LinkCard;
  setField: <K extends keyof LinkCard>(key: K, value: LinkCard[K]) => void;
  onClose: () => void;
  onSubmit: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

function EditLinkForm({ formData,setField,onClose,onSubmit }:Props) {
  return (
    <form
      className="flex-1 overflow-y-auto p-6"
    >
      <div className="space-y-5">
        <EditLinkCategory formData={formData} setField={ setField} />
        <EditLinkRating formData={formData} setField={ setField} />
        {/* 메모 */}
        <EditLinkMemo formData={formData} setField={ setField} />
      </div>
      <EditLinkButtonWrap onClose={onClose} onSubmit={ onSubmit} />
    </form>
  );
}
export default EditLinkForm