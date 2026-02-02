import { usePostLink } from "../../../api/usePostLinks";
import { sweetSuccess } from "@/shared/utill/swir";
import CreateLinkModalHeader from "./CreateLinkModalHeader";
import CreateLinkForm from "./CreateLinkForm";
import useCreateForm from "@/feature/schdule/hooks/useCreateForm";

interface Props{
  onClose: () => void
}

function LinkModal({ onClose }: Props) {
  
  const { mutate } = usePostLink()
  const { form, setField } = useCreateForm()
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    mutate(
      {
        formData: form,
        meetingId: form.meetingId,
      },
      {
        onSuccess: () => {
          sweetSuccess("링크가 추가되었습니다.");
          onClose()
        },
      }
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg w-full max-w-2xl max-h-[90vh] z-9 flex flex-col shadow-2xl">
      <CreateLinkModalHeader onClose={onClose}/>
      <CreateLinkForm form={form} setField={setField} onSubmit={handleSubmit} onClose={onClose} />
    </div>
  );
}
export default LinkModal