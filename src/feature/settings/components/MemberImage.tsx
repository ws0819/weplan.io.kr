import { useGetUser } from "@/app/layout/api/useGetUser";

interface Props{
  userId:string
}

function MemberImage({ userId }: Props) {

  const { data } = useGetUser(userId)
  return (
    <div
      className="w-8 h-8 rounded-full overflow-hidden  border-2 border-white flex items-center justify-center"
      key={userId}
    >
      <img src={data?.picture ?? ''} alt={`${data?.name ?? ""}님의 프로필 이미지`} />
    </div>
  );
}
export default MemberImage