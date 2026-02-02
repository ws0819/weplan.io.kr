import { IoIosArrowBack } from "react-icons/io";

interface Props{
  onNavigate:()=>void
}

function LoginBackButton({ onNavigate}:Props) {
  return (
    <button onClick={onNavigate} aria-label="뒤로가기">
      <IoIosArrowBack size={24} />
    </button>
  );
}
export default LoginBackButton