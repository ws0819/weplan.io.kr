import { lazy, useState } from "react";
import FloatButton from "@/shared/components/button/FloatButton";
import GroupHeader from "./components/GroupHeader";
import GroupGrid from "./components/GroupGrid";
import SEO from "@/shared/components/seo/SEO";

const CreateGroupModal = lazy(()=> import("./components/create/CreateGroupModal"))

function MyGroup() {
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  return (
    <>
      <SEO title='홈'
        description="위플랜으로 모임을 계획하세요"
        keyword="모임, 여행, 계획"
      />
      <div className="mt-5 lg:mt-10">
        <GroupHeader onClick={() => setIsCreateModalOpen(true)} />
        <GroupGrid />

        <div className="fixed bottom-5 right-5 sm:hidden">
          <FloatButton onClick={() => setIsCreateModalOpen(true)} />
        </div>

        <CreateGroupModal
          open={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </div>
    </>
  );
}
export default MyGroup