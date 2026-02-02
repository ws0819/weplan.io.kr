import { useState } from "react";
import WelcomePopup from "../mygroup/components/WelcomePopup";
import LinkModal from "./components/modal/create/LinkModal";
import useWelcome from "./hooks/useWelcome";
import FloatButton from "@/shared/components/button/FloatButton";
import CardItems from "./components/CardItems";
import SEO from "@/shared/components/seo/SEO";

function Schedule() {

  const [isCreateLinkModal, setIsCreateLinkModal] = useState(false);
  const { showWelcome } = useWelcome()

  
  return (
    <>
      <SEO
      title='일정'
      description="링크를 복사하고 한 눈에 일정을 확인해보세요."
      keyword="모임 일정, 일정 관리"
      />
      <div className="my-5">
        <main className=" bg-gray-50 rounded-lg flex flex-col md:flex-row gap-6 md:gap-8 p-4 md:p-4 md:mt-7 lg:min-h-[80vh]">
          <CardItems onOpen={() => setIsCreateLinkModal(true)} />
        </main>
        <div className="fixed bottom-16 right-6">
          <FloatButton onClick={() => setIsCreateLinkModal(true)} />
        </div>

        {/* 첫 그룹 생성시 팝업 */}
        {showWelcome && (
          <WelcomePopup
            onClose={() => {
              window.location.reload();
            }}
          />
        )}

        {isCreateLinkModal && (
          <div className="flex-center bg-black/30 fixed inset-0 h-screen w-screen z-9">
            <LinkModal onClose={() => setIsCreateLinkModal(false)} />
          </div>
        )}
      </div>
    </>
  );
}
export default Schedule;
