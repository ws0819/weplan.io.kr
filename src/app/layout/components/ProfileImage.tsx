import type { User } from "@/types/type";
import { Link, useNavigate } from "react-router";

interface Props{
  data:User
}

function ProfileImage({ data }: Props) {
  
  const navigate = useNavigate()

  return (
    <>
      {data ? (
        <Link
          to="/mypage"
          className="w-8 h-8 overflow-hidden rounded-full md:w-10 md:h-10"
        >
          <img
            src={data.picture}
            alt={data.name}
            width={40}
            height={40}
            loading="lazy"
            fetchPriority="high"
          />
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="font-semibold texl-lg"
          aria-label="로그인"
        >
          Login
        </button>
      )}
    </>
  );
}
export default ProfileImage