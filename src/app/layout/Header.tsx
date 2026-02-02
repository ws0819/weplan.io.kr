import { initAuth } from "@/shared/store/useUserStore";
import { useGetUser } from "./api/useGetUser";
import HeaderLogo from "./components/HeaderLogo";
import ProfileImage from "./components/ProfileImage";

function Header() {
  const userId = initAuth()
  const { data } = useGetUser(userId ?? '')

  return (
    <header className="bg-white w-full flex items-center justify-between py-3 px-4 sm:px-10 ">
     <HeaderLogo/>
     <ProfileImage data={data } />
    </header>
  );
}
export default Header