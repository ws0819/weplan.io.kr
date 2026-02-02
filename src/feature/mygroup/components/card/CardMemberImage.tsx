import { useGetUser } from "@/app/layout/api/useGetUser";

interface Props{
  userId:string
}

function CardMemberImage({ userId }:Props) {

  const { data,isLoading } = useGetUser(userId ?? '')

    if (isLoading) {
      return <p>로딩중</p>;
    }
  return (
     <>
        <img
        src={data?.picture ?? ""}
        alt={`${data?.name ?? ""}님의 프로필이미지`}
        width={32}
        height={32}
        loading="lazy"
        fetchPriority="high"
        />

    </>
  );
}
export default CardMemberImage