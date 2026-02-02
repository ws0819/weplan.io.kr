import { FiX } from "react-icons/fi";

interface Props{
  onClose:()=>void
}


function EditLinkHeader({ onClose }:Props) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
      <h2 className="text-xl font-semibold">✏️ 링크 수정</h2>
      <button
        onClick={onClose}
        className="p-2 hover:bg-gray-100 rounded-full transition"
      >
        <FiX size={24} />
      </button>
    </header>
  );
}
export default EditLinkHeader