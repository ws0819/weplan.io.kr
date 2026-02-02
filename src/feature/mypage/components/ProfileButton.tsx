import { IoMdArrowForward } from "react-icons/io";

interface Props{
   children:React.ReactNode
 }

function ProfileButton({ children }:Props) {
  return (
    <button className="border border-lightgray w-full h-12 p-3 rounded-lg flex items-center justify-between">
      {children}
      <IoMdArrowForward />
    </button>
  );
}
export default ProfileButton