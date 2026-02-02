// src/pages/Terms.tsx
function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          서비스 이용약관
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          최종 수정일: 2026년 1월 27일
        </p>

        {/* 제1조 목적 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-primary">
            제1조 (목적)
          </h2>
          <p className="text-gray-600 leading-relaxed">
            본 약관은 위플랜(이하 "회사")이 제공하는 여행 및 모임 계획 서비스(이하 "서비스")의
            이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을
            규정함을 목적으로 합니다.
          </p>
        </section>

        {/* 제2조 정의 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-primary">
            제2조 (정의)
          </h2>
          <div className="space-y-3 text-gray-600">
            <div>
              <span className="font-medium text-gray-800">① "서비스"</span>란
              회사가 제공하는 여행 및 모임 계획을 위한 링크 관리, 일정 관리, 예산 관리 등의
              온라인 플랫폼 서비스를 의미합니다.
            </div>
            <div>
              <span className="font-medium text-gray-800">② "회원"</span>이란
              본 약관에 동의하고 회사가 제공하는 서비스를 이용하는 자를 말합니다.
            </div>
            <div>
              <span className="font-medium text-gray-800">③ "모임"</span>이란
              회원이 생성한 여행 또는 모임 계획 단위를 의미합니다.
            </div>
            <div>
              <span className="font-medium text-gray-800">④ "콘텐츠"</span>란
              회원이 서비스에 게시하거나 등록하는 링크, 메모, 예산 정보 등을 의미합니다.
            </div>
          </div>
        </section>

        {/* 제3조 약관의 효력 및 변경 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-primary">
            제3조 (약관의 효력 및 변경)
          </h2>
          <div className="space-y-3 text-gray-600">
            <p>
              <span className="font-medium text-gray-800">①</span> 본 약관은
              서비스 화면에 게시하거나 기타의 방법으로 회원에게 공지함으로써 효력이 발생합니다.
            </p>
            <p>
              <span className="font-medium text-gray-800">②</span> 회사는
              필요한 경우 관련 법령을 위배하지 않는 범위 내에서 본 약관을 변경할 수 있으며,
              변경된 약관은 시행일자 7일 전부터 공지합니다.
            </p>
            <p>
              <span className="font-medium text-gray-800">③</span> 회원이
              변경된 약관에 동의하지 않는 경우 서비스 이용을 중단하고 탈퇴할 수 있습니다.
              변경된 약관의 효력 발생일 이후에도 서비스를 계속 이용할 경우 약관의 변경 사항에
              동의한 것으로 간주합니다.
            </p>
          </div>
        </section>

        {/* 제4조 회원가입 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-primary">
            제4조 (회원가입)
          </h2>
          <div className="space-y-3 text-gray-600">
            <p>
              <span className="font-medium text-gray-800">①</span> 회원가입은
              이용자가 본 약관의 내용에 동의하고 회사가 정한 가입 양식에 따라 회원정보를
              기입한 후 가입 신청을 하고, 회사가 이를 승낙함으로써 완료됩니다.
            </p>
            <p>
              <span className="font-medium text-gray-800">②</span> 회사는
              다음 각 호에 해당하는 경우 회원가입을 거부할 수 있습니다:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>타인의 명의를 도용한 경우</li>
              <li>허위 정보를 기재한 경우</li>
              <li>과거에 회원 자격을 상실한 적이 있는 경우</li>
              <li>기타 회사가 정한 이용 요건을 충족하지 못한 경우</li>
            </ul>
            <p>
              <span className="font-medium text-gray-800">③</span> 회원가입은
              Google 계정을 통한 소셜 로그인 방식으로 진행됩니다.
            </p>
          </div>
        </section>

        {/* 제5조 서비스의 제공 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-primary">
            제5조 (서비스의 제공)
          </h2>
          <div className="space-y-3 text-gray-600">
            <p>
              <span className="font-medium text-gray-800">①</span> 회사는
              다음과 같은 서비스를 제공합니다:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>여행 및 모임 계획 생성 및 관리</li>
              <li>링크 수집 및 정리 기능</li>
              <li>지도 기반 거리 계산 및 동선 관리</li>
              <li>예산 관리 및 N빵 계산</li>
              <li>실시간 협업 기능</li>
              <li>기타 회사가 추가 개발하거나 제휴를 통해 제공하는 서비스</li>
            </ul>
            <p>
              <span className="font-medium text-gray-800">②</span> 서비스는
              연중무휴 1일 24시간 제공함을 원칙으로 합니다. 다만, 시스템 정기 점검, 증설 및
              교체를 위해 회사가 정한 날이나 시간에는 서비스가 일시 중단될 수 있습니다.
            </p>
            <p>
              <span className="font-medium text-gray-800">③</span> 회사는
              서비스를 일정 범위로 분할하여 각 범위별로 이용 가능 시간을 별도로 정할 수 있으며,
              이 경우 그 내용을 사전에 공지합니다.
            </p>
          </div>
        </section>

        {/* 제6조 서비스의 변경 및 중단 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-primary">
            제6조 (서비스의 변경 및 중단)
          </h2>
          <div className="space-y-3 text-gray-600">
            <p>
              <span className="font-medium text-gray-800">①</span> 회사는
              운영상, 기술상의 필요에 따라 제공하고 있는 서비스의 전부 또는 일부를 변경할 수
              있습니다.
            </p>
            <p>
              <span className="font-medium text-gray-800">②</span> 회사는
              다음 각 호에 해당하는 경우 서비스의 전부 또는 일부를 제한하거나 중단할 수 있습니다:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>서비스용 설비의 보수 등 공사로 인한 부득이한 경우</li>
              <li>전기통신사업법에 규정된 기간통신사업자가 전기통신 서비스를 중지했을 경우</li>
              <li>국가비상사태, 정전, 서비스 설비의 장애 또는 서비스 이용의 폭주 등으로 정상적인 서비스 이용에 지장이 있는 경우</li>
              <li>기타 불가항력적 사유가 있는 경우</li>
            </ul>
          </div>
        </section>

        {/* 제7조 회원의 의무 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-primary">
            제7조 (회원의 의무)
          </h2>
          <div className="space-y-3 text-gray-600">
            <p>
              <span className="font-medium text-gray-800">①</span> 회원은
              다음 행위를 해서는 안 됩니다:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>신청 또는 변경 시 허위 내용의 등록</li>
              <li>타인의 정보 도용</li>
              <li>회사가 게시한 정보의 변경</li>
              <li>회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</li>
              <li>회사 및 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
              <li>회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
              <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위</li>
              <li>회사의 동의 없이 영리를 목적으로 서비스를 사용하는 행위</li>
              <li>기타 불법적이거나 부당한 행위</li>
            </ul>
            <p>
              <span className="font-medium text-gray-800">②</span> 회원은
              관계 법령, 본 약관의 규정, 이용안내 및 서비스와 관련하여 공지한 주의사항,
              회사가 통지하는 사항 등을 준수하여야 하며, 기타 회사의 업무에 방해되는 행위를
              해서는 안 됩니다.
            </p>
          </div>
        </section>

        {/* 제8조 회원 탈퇴 및 자격 상실 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-primary">
            제8조 (회원 탈퇴 및 자격 상실)
          </h2>
          <div className="space-y-3 text-gray-600">
            <p>
              <span className="font-medium text-gray-800">①</span> 회원은
              언제든지 회사에 탈퇴를 요청할 수 있으며, 회사는 즉시 회원 탈퇴를 처리합니다.
            </p>
            <p>
              <span className="font-medium text-gray-800">②</span> 회사는
              다음 각 호의 사유가 발생한 경우 회원의 자격을 제한 또는 정지시킬 수 있습니다:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>가입 신청 시 허위 내용을 등록한 경우</li>
              <li>다른 사람의 서비스 이용을 방해하거나 그 정보를 도용하는 등 전자상거래 질서를 위협하는 경우</li>
              <li>서비스를 이용하여 법령 또는 본 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우</li>
            </ul>
            <p>
              <span className="font-medium text-gray-800">③</span> 회원이
              탈퇴하거나 자격이 상실된 경우 회원이 작성한 게시물 및 콘텐츠는 삭제됩니다. 다만,
              다른 회원과 공유된 모임의 경우 해당 회원의 정보만 삭제되며 모임 자체는 유지됩니다.
            </p>
          </div>
        </section>

        {/* 제9조 게시물의 저작권 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-primary">
            제9조 (게시물의 저작권)
          </h2>
          <div className="space-y-3 text-gray-600">
            <p>
              <span className="font-medium text-gray-800">①</span> 회원이
              서비스 내에 게시한 게시물의 저작권은 해당 게시물의 저작자에게 귀속됩니다.
            </p>
            <p>
              <span className="font-medium text-gray-800">②</span> 회원이
              서비스 내에 게시하는 게시물은 검색 결과 내지 서비스 및 관련 프로모션 등에 노출될 수
              있으며, 해당 노출을 위해 필요한 범위 내에서는 일부 수정, 복제, 편집되어 게시될 수
              있습니다. 이 경우, 회사는 저작권법 규정을 준수하며, 회원은 언제든지 고객센터 또는
              서비스 내 관리 기능을 통해 해당 게시물에 대해 삭제, 검색 결과 제외, 비공개 등의
              조치를 취할 수 있습니다.
            </p>
          </div>
        </section>

        {/* 제10조 책임의 제한 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-primary">
            제10조 (책임의 제한)
          </h2>
          <div className="space-y-3 text-gray-600">
            <p>
              <span className="font-medium text-gray-800">①</span> 회사는
              천재지변, 전쟁 또는 기타 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는
              경우에는 서비스 제공에 관한 책임이 면제됩니다.
            </p>
            <p>
              <span className="font-medium text-gray-800">②</span> 회사는
              회원의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.
            </p>
            <p>
              <span className="font-medium text-gray-800">③</span> 회사는
              회원이 서비스를 이용하여 기대하는 수익을 상실한 것에 대하여 책임을 지지 않으며,
              그 밖의 서비스를 통하여 얻은 자료로 인한 손해에 관하여 책임을 지지 않습니다.
            </p>
            <p>
              <span className="font-medium text-gray-800">④</span> 회사는
              회원이 게재한 정보, 자료, 사실의 신뢰도, 정확성 등의 내용에 관하여는 책임을 지지
              않습니다.
            </p>
          </div>
        </section>

        {/* 제11조 분쟁 해결 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-primary">
            제11조 (분쟁 해결)
          </h2>
          <div className="space-y-3 text-gray-600">
            <p>
              <span className="font-medium text-gray-800">①</span> 회사는
              회원이 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여
              고객센터를 설치·운영합니다.
            </p>
            <p>
              <span className="font-medium text-gray-800">②</span> 회사는
              회원으로부터 제출되는 불만사항 및 의견은 우선적으로 그 사항을 처리합니다. 다만,
              신속한 처리가 곤란한 경우에는 회원에게 그 사유와 처리일정을 즉시 통보해 드립니다.
            </p>
            <p>
              <span className="font-medium text-gray-800">③</span> 회사와
              회원 간에 발생한 전자상거래 분쟁과 관련하여 회원의 피해구제신청이 있는 경우에는
              공정거래위원회 또는 시·도지사가 의뢰하는 분쟁조정기관의 조정에 따를 수 있습니다.
            </p>
          </div>
        </section>

        {/* 제12조 재판권 및 준거법 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-primary">
            제12조 (재판권 및 준거법)
          </h2>
          <div className="space-y-3 text-gray-600">
            <p>
              <span className="font-medium text-gray-800">①</span> 회사와
              회원 간 발생한 전자상거래 분쟁에 관한 소송은 민사소송법상의 관할법원에 제기합니다.
            </p>
            <p>
              <span className="font-medium text-gray-800">②</span> 회사와
              회원 간 제기된 전자상거래 소송에는 대한민국 법을 적용합니다.
            </p>
          </div>
        </section>

        {/* 부칙 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-primary">
            부칙
          </h2>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="font-medium text-blue-900">
              본 약관은 2026년 1월 27일부터 시행됩니다.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}

export default Terms;