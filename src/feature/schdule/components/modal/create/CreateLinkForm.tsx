import type { Link } from "@/feature/schdule/types/link";
import CreateLinkUrl from "./CreateLinkUrl";
import CreateLinkCategory from "./CreateLinkCategory";
import CreateLinkRating from "./CreateLinkRating";
import CreateLinkMemo from "./CreateLinkMemo";
import CreateLinkButtonWrap from "./CreateLinkButtonWrap";


interface Props {
  form: Link;
  setField: <K extends keyof Link>(key: K, value: Link[K]) => void;
  onSubmit: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onClose: () => void;
}

function CreateLinkForm({ form,setField,onClose,onSubmit}:Props ) {
  return (
    <form className="flex-1 p-6 flex flex-col gap-3">
      <CreateLinkUrl form={ form } setField={setField} />
      <CreateLinkCategory form={ form} setField={setField} />
      <CreateLinkRating form={form} setField={ setField } />
      <CreateLinkMemo form={form} setField={setField} />
      <CreateLinkButtonWrap onClose={onClose} onSubmit={ onSubmit} />
    </form>
  );
}
export default CreateLinkForm