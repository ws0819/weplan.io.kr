import { Link, NavLink, useParams } from "react-router";
import { NAVITEM } from "../constant/navItem";
import HeaderLogo from "./HeaderLogo";
import clsx from "clsx";
import { useGetUser } from "../api/useGetUser";
import { initAuth } from "@/shared/store/useUserStore";
import { useGetMember } from "@/feature/mygroup/api/useGetMember";

function WebSideBar() {
  const { id } = useParams()
  const  userId = initAuth() 
  const { data, isLoading } = useGetUser(userId ?? '') 
  const { data:memberData,isLoading:meetingLoading} = useGetMember(id ?? '')

 
  if (isLoading || meetingLoading) {
    return (
      <div>
        로딩 중입니다.
      </div>
    )
  }
   const currentMember = memberData?.find((m) => m.userId === userId);
   const isOwner = currentMember?.role === "owner";

  return (
    <nav className="hidden lg:flex bg-white md:w-67 md:min-h-screen flex-col justify-between p-3 py-8">
      <div>
        <HeaderLogo />
        <ul className="flex flex-col gap-5 mt-20">
          {NAVITEM.map(({ to, label }) => { 
                if (to === "settings" && !isOwner) {
                  return null;
                }
           return (
            <li key={label}>
              <NavLink
                to={`/meeting/${id}/${to}`}
                className={({ isActive }) =>
                  clsx(
                    "px-3 py-2 rounded-lg block duration-200",
                    isActive
                      ? "bg-primary text-white"
                      : "hover:bg-secondary/50",
                  )
                }
              >
                {label}
              </NavLink>
            </li>
          )
          }
         )}
        </ul>
      </div>
      <Link to='/mypage' className="border-t border-lightgray flex gap-3 p-2">
       
          <img
            src={data.picture}
            alt={`${data.name}님의 프로필이미지`}
            className="w-8 h-8 rounded-full"
          />
     
        <span>
          <strong>{data.name}</strong>
          <p className="text-xs text-lightgray">{data.email}</p>
        </span>
      </Link>
    </nav>
  );
}
export default WebSideBar