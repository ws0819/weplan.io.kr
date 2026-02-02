// src/pages/Privacy.tsx
function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          개인정보 처리방침
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          최종 수정일: 2026년 1월 27일
        </p>

        {/* 1. 수집하는 개인정보 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-primary">
            1. 수집하는 개인정보 항목
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                ① 회원가입 시 수집항목 (Google 로그인)
              </h3>
              <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                <li>이메일 주소 (필수)</li>
                <li>프로필 정보: 이름, 프로필 사진 (필수)</li>
                <li>Google 계정 식별자 (필수)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                ② 서비스 이용 과정에서 자동 수집되는 정보
              </h3>
              <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                <li>IP 주소, 쿠키, 방문 일시</li>
                <li>서비스 이용 기록</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 2. 수집 및 이용 목적 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-primary">
            2. 개인정보의 수집 및 이용 목적
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
            <li>회원 가입 및 관리</li>
            <li>서비스 제공 및 계약 이행</li>
            <li>회원과 비회원의 서비스 이용에 대한 본인 확인 및 개인 식별</li>
            <li>부정 이용 방지 및 비인가 사용 방지</li>
            <li>서비스 개선 및 신규 서비스 개발</li>
            <li>고객 문의 및 민원 처리</li>
          </ul>
        </section>

        {/* 3. 보유 및 이용 기간 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-primary">
            3. 개인정보의 보유 및 이용 기간
          </h2>
          <div className="space-y-3 text-gray-600">
            <p>
              회사는 회원 가입 시점부터 서비스를 제공하는 기간 동안에 한하여
              이용자의 개인정보를 보유 및 이용하게 됩니다.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-medium text-blue-900 mb-2">
                회원 탈퇴 시
              </p>
              <p className="text-blue-800">
                회원이 탈퇴를 요청하거나 개인정보 삭제를 요청하는 경우,
                수집된 개인정보는 <strong>즉시 파기</strong>됩니다.
              </p>
            </div>
            <div>
              <p className="font-medium text-gray-700 mb-2">
                단, 관계 법령에 의해 보존할 필요가 있는 경우
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>
                  계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래법)
                </li>
                <li>
                  소비자 불만 또는 분쟁 처리에 관한 기록: 3년 (전자상거래법)
                </li>
                <li>부정이용 등에 관한 기록: 1년 (정보통신망법)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 4. 개인정보 제3자 제공 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-primary">
            4. 개인정보의 제3자 제공
          </h2>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-green-900">
              회사는 이용자의 개인정보를 <strong>제3자에게 제공하지 않습니다.</strong>
              단, 이용자의 동의가 있거나 법령의 규정에 의한 경우는 예외로 합니다.
            </p>
          </div>
        </section>

        {/* 5. 개인정보 처리 위탁 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-primary">
            5. 개인정보 처리 위탁
          </h2>
          <div className="space-y-3 text-gray-600">
            <p>
              회사는 원활한 서비스 제공을 위해 다음과 같이 개인정보 처리 업무를
              외부에 위탁하고 있습니다.
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      수탁업체
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      위탁 업무
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">
                      Google LLC
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      회원 가입 및 인증 서비스
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">
                      Amazon Web Services (AWS)
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      클라우드 서버 및 데이터 보관
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 6. 정보주체의 권리 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-primary">
            6. 정보주체의 권리·의무 및 행사 방법
          </h2>
          <div className="space-y-3 text-gray-600">
            <p>
              이용자는 언제든지 다음과 같은 권리를 행사할 수 있습니다.
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>개인정보 열람 요구</li>
              <li>개인정보 오류 정정 요구</li>
              <li>개인정보 삭제 요구</li>
              <li>개인정보 처리 정지 요구</li>
              <li>회원 탈퇴 (계정 삭제)</li>
            </ul>
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <p className="font-medium text-gray-800 mb-2">권리 행사 방법</p>
              <p>
                이메일: <a href="mailto:mtm1018@naver.com" className="text-primary hover:underline">mtm1018@naver.com</a>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                ※ 요청 접수 후 10일 이내에 처리 결과를 안내해 드립니다.
              </p>
            </div>
          </div>
        </section>

        {/* 7. 개인정보 파기 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-primary">
            7. 개인정보의 파기 절차 및 방법
          </h2>
          <div className="space-y-4 text-gray-600">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                ① 파기 절차
              </h3>
              <p>
                이용자가 회원 가입 등을 위해 입력한 정보는 목적이 달성된 후
                별도의 DB로 옮겨져(종이의 경우 별도의 서류함) 내부 방침 및
                기타 관련 법령에 의한 정보보호 사유에 따라 일정 기간 저장된 후
                파기됩니다.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                ② 파기 방법
              </h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>
                  전자적 파일 형태: 복구 및 재생이 불가능한 기술적 방법으로 삭제
                </li>
                <li>종이 문서: 분쇄기로 분쇄하거나 소각</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 8. 개인정보 보호책임자 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-primary">
            8. 개인정보 보호책임자
          </h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-medium">성명:</span> 김태민
              </p>
              <p>
                <span className="font-medium">이메일:</span>{' '}
                <a href="mailto:mtm1018@naver.com" className="text-primary hover:underline">
                  mtm1018@naver.com
                </a>
              </p>
              <p className="text-sm text-gray-600 mt-4">
                ※ 개인정보 침해에 대한 신고나 상담이 필요한 경우 아래 기관에
                문의하실 수 있습니다.
              </p>
              <ul className="text-sm text-gray-600 space-y-1 mt-2">
                <li>• 개인정보침해신고센터 (privacy.kisa.or.kr / 118)</li>
                <li>• 개인정보분쟁조정위원회 (www.kopico.go.kr / 1833-6972)</li>
                <li>• 대검찰청 사이버수사과 (www.spo.go.kr / 1301)</li>
                <li>• 경찰청 사이버안전국 (cyberbureau.police.go.kr / 182)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 9. 개인정보 처리방침 변경 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-primary">
            9. 개인정보 처리방침 변경
          </h2>
          <div className="text-gray-600">
            <p>
              본 개인정보 처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른
              변경 내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행
              7일 전부터 공지사항을 통하여 고지할 것입니다.
            </p>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="font-medium text-blue-900">
                공고 일자: 2026년 1월 27일
              </p>
              <p className="font-medium text-blue-900">
                시행 일자: 2026년 1월 27일
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Privacy;