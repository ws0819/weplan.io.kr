
import CancleButton from "@/shared/components/button/CancleButton";
import SubmitButton from "@/shared/components/button/SubmitButton";

interface Props {
  onClose: () => void;
  onSubmit: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

function CreateBudgetButtonWrap({ onClose,onSubmit}:Props) {
  return (
    <div className="flex gap-3 mt-4">
      <CancleButton onClose={ onClose} />
      <SubmitButton onSubmit={onSubmit} text='추가'/>
    </div>
  );
}
export default CreateBudgetButtonWrap