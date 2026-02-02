import { FiX } from "react-icons/fi";


interface Props{
  onClose: () => void
}

function CreateLinkModalHeader({onClose}:Props) {
  return (
    <header className="flex justify-between items-center px-6 py-4 border-b border-border shrink-0">
      <h1 className="text-2xl font-semibold">링크 추가</h1>
      <button type="button" onClick={onClose}>
        <FiX size={24} />
      </button>
    </header>
  );
}
export default CreateLinkModalHeader