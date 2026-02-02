import { IoArrowBackOutline } from "react-icons/io5";


interface Props{
  onClick : () => void
}

function BackButton({onClick}:Props) {

  return (
    <button type="button" className="absolute top-1/2 left-0 -translate-y-1/2" onClick={onClick}>
      <IoArrowBackOutline size={24} aria-label="뒤로가기" />
    </button>
  );
}
export default BackButton