interface Props {
  onSubmit: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  text: string;
}

function SubmitButton({ onSubmit,text}:Props) {
  return (
    <button
      type="submit"
      className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
      onClick={(e)=>onSubmit(e)}
    >
     {text}
    </button>
  );
}
export default SubmitButton