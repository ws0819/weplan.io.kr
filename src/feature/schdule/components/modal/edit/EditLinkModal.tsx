import { sweetEdit } from "@/shared/utill/swir";
import { useUDLink } from "@/feature/schdule/api/useUDLinks";
import EditLinkHeader from "./EditLinkHeader";
import EditLinkForm from "./EditLinkForm";
import useEditForm from "@/feature/schdule/hooks/useEditForm";
import { useParams } from "react-router";

interface Props {
  id:string
  title: string;
  memo: string;
  rating: number;
  url: string;
  category: string;
  onClose: () => void;
}

function EditLinkModal({ id,title,memo,rating,url,category, onClose }: Props) {

  const {id:meeting_id} = useParams()
  const {formData,setField} = useEditForm({title,memo,rating,url,category})
  const { mutate }=useUDLink()
  const handleEdit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    sweetEdit(() => {
      mutate({
        meeting_id : meeting_id ?? '',
        id,
        op: "u",
        fields: formData,
      });
      onClose()
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <EditLinkHeader onClose={onClose} />
        <EditLinkForm formData={formData} setField={setField} onClose={onClose} onSubmit={handleEdit} />
      </div>
    </div>
  );
}
export default EditLinkModal