import clsx from "clsx";
import { NAVITEM } from "../constant/navItem";
import { NavLink, useParams } from "react-router";
import { useGetMember } from "@/feature/mygroup/api/useGetMember";
import { initAuth } from "@/shared/store/useUserStore";

function MobileSideBar() {
  const { id } = useParams()
   const  userId = initAuth() 
    const { data:memberData,isLoading:meetingLoading} = useGetMember(id ?? '')
  if (meetingLoading) {
    return <div>로딩 중입니다.</div>;
  }
  const currentMember = memberData?.find((m) => m.user_id === userId);
  const isOwner = currentMember?.role === "owner";

  return (
    <nav className="fixed mobile-view bottom-0 left-0 sm:web-view p-0 w-full bg-white border-t border-gray-200 z-9 lg:hidden">
      <ul className="flex justify-around items-center">
        {NAVITEM.map(({ to, label }) => {
          if (to === "settings" && isOwner) {
            return null;
          }
          return (
            <li key={label} className="flex-1 text-center font-semibold">
              <NavLink
                to={`/meeting/${id}/${to}`}
                className={({ isActive }) =>
                  clsx(
                    "px-4 py-4 block duration-200 ",
                    isActive
                      ? "bg-primary text-white"
                      : "hover:bg-secondary/50",
                  )
                }
              >
                {label}
              </NavLink>
            </li>
          );
        }
       )}
      </ul>
    </nav>
  );
}
export default MobileSideBar