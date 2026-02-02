import { useGetUser } from "@/app/layout/api/useGetUser";


interface Props{
  userId: string;
}

function BudgetLeaderImage({ userId }: Props) {
  
    const { data:user} = useGetUser(userId)
  
  return (
    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 ">
      <div>
        <div className="mb-1 flex gap-2 items-center">
          <img
            src={user?.picture ?? ""}
            alt={`${user?.name ?? ""}의 프로필 이미지`}
            className="w-6 h-6 rounded-full"
          />
          <p className="text-lg">{user?.name ?? ""}</p>
        </div>
      </div>
    </div>
  );
}
export default BudgetLeaderImage