import { IoCopyOutline } from "react-icons/io5";
import { MdDoneAll } from "react-icons/md";

interface Props{
  copy:boolean
  onCopy: () =>void
}

function BudgetCopyButton({ copy,onCopy}:Props) {
  return (
    <button type="button" onClick={onCopy} aria-label='계좌번호 복사'>
      {copy ? <MdDoneAll size={24} /> : <IoCopyOutline size={24} />}
    </button>
  );
}
export default BudgetCopyButton