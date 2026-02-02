import { sweetSuccess } from "@/shared/utill/swir";
import type { Invite } from "../type/settings";


export function loadInviteUrl(data:Invite) {
    const inviteLink = data?.inviteUrl
      ? `${window.location.origin}/invite/${data.inviteUrl}`
      : "";

    const copyInviteLink = () => {
      navigator.clipboard.writeText(inviteLink);
      sweetSuccess("초대 링크가 복사되었습니다!");
  };
  
  return{ inviteLink,copyInviteLink }
}