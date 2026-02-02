import Button from "@/shared/components/button/Button";
import { useAuth } from "@/shared/store/useUserStore";

function Logout() {

  const { logOut } = useAuth()

  return (
    <Button variant="secondary" size="lg" onClick={logOut}>
      로그아웃
    </Button>
  );
}
export default Logout