import { IoClose } from "react-icons/io5";

interface Props{
  onClose:() =>void
}

function SecretaryModalHeader({ onClose}:Props) {
  return (
    <header className="flex-center py-2 px-3 border-b border-border relative">
      <button
        className="absolute top-1/2 left-0 -translate-y-1/2 p-1 rounded-full duration-200 hover:bg-gray-100"
        aria-label="총무 등록 창 닫기"
        onClick={onClose}
      >
        <IoClose size={24} />
      </button>
      <h2 className="text-xl font-semibold">총무 등록</h2>
    </header>
  );
}
export default SecretaryModalHeader