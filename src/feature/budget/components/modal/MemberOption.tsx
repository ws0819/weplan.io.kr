import { useGetUser } from "@/app/layout/api/useGetUser";

function MemberOption({ userId }: { userId: string }) {
  const { data, isLoading } = useGetUser(userId) 
  
  if (isLoading) {
    return (
      <p>로딩중</p>
    )
  }

  return <option key={userId} value={userId}>{data.name}</option>;
}
export default MemberOption