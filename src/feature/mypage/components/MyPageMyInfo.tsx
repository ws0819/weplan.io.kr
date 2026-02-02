import { useGetUser } from "@/app/layout/api/useGetUser";
import { initAuth } from "@/shared/store/useUserStore";

function MyPageMyInfo() {

  const userId = initAuth()
  const { data } = useGetUser(userId ?? '')

  return (
    <section className="flex flex-col border-b border-lightgray items-center py-6">
      <img src={data.picture} alt={`${data.name}님의 프로필 이미지`} className="h-18 w-18 rounded-full" />
      <div className="flex flex-col items-center">
        <b className="text-xl">{ data.name}</b>
        <p className="text-darkgray">{ data.email}</p>
      </div>
    </section>
  );
}
export default MyPageMyInfo