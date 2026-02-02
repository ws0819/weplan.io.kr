import CancleButton from "../../../../../shared/components/button/CancleButton";
import SubmitButton from "../../../../../shared/components/button/SubmitButton";

interface Props {
  onClose: () => void;
  onSubmit: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
} 

function EditLinkButtonWrap({onClose,onSubmit}:Props) {
  return (
    <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
      <CancleButton onClose={onClose}/>
      <SubmitButton onSubmit={onSubmit} text='수정 완료'/>
    </div>
  );
}
export default EditLinkButtonWrap