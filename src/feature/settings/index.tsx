import { useState } from "react";
import SettingInfo from "./components/SettingInfo";
import SettingMember from "./components/SettingMember";
import SettingCloseMeeting from "./components/SettingCloseMeeting";
import InviteLinkModal from "./components/modal/InviteLinkModal";
import CloseMeetingModal from "./components/modal/CloseMeetingModal";
import SEO from "@/shared/components/seo/SEO";

function Settings() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <>
      <SEO
        title='설정'
        description="위 플랜에서 모임정보를 설정하고 초대링크를 친구에게 보내보세요"
        keyword="설정, 친구초대, 초대, 정보 수정"
      />
      <div className="my-5 bg-gray-50 rounded-lg">
        <main className=" mx-auto p-4 space-y-6">
          <SettingInfo />
          <SettingMember onOpen={() => setShowInviteModal(true)} />
          <SettingCloseMeeting onOpen={() => setShowDeleteConfirm(true)} />
        </main>

        {showInviteModal && (
          <InviteLinkModal onClose={() => setShowInviteModal(false)} />
        )}

        {showDeleteConfirm && (
          <CloseMeetingModal onClose={() => setShowDeleteConfirm(false)} />
        )}
      </div>
    </>
  );
}
export default Settings