import CancleButton from "../../../../../shared/components/button/CancleButton";
import SubmitButton from "../../../../../shared/components/button/SubmitButton";

interface Props {
  onSubmit: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onClose: () => void;
}

function CreateLinkButtonWrap({ onClose,onSubmit}:Props) {
  return (
    <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
      <CancleButton onClose={ onClose } />
      <SubmitButton onSubmit={ onSubmit } text='추가하기'/>
    </div>
  );
}
export default CreateLinkButtonWrap