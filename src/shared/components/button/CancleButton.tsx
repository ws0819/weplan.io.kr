interface Props{
  onClose: () =>void
}

function CancleButton({ onClose}:Props) {
  return (
    <button
      type="button"
      onClick={onClose}
      className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
    >
      취소
    </button>
  );
}
export default CancleButton