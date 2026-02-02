import { FiX } from "react-icons/fi";

interface Props{
  onClose:()=>void
}
function EditMeetingHeader({ onClose}:Props) {
  return (
    <header className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold">모임 정보 수정</h2>
      <button
        onClick={onClose}
        className="p-2 hover:bg-gray-100 rounded-full transition"
      >
        <FiX size={24} />
      </button>
    </header>
  );
}
export default EditMeetingHeader