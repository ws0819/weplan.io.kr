import BackButton from "@/shared/components/button/BackButton";
import { useNavigate } from "react-router";

function MyPageHeader() {

  const navigate = useNavigate()

  return (
    <header className="flex justify-center gap-2 px-3 py-2 border-b-[0.5px] border-lightgray relative">
      <BackButton onClick={()=> navigate('/')} />
      <h3 className="text-xl font-semibold">내 정보</h3>
    </header>
  );
}
export default MyPageHeader