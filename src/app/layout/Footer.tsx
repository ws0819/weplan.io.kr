// src/shared/components/Footer.tsx
function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-8 mt-auto ">
      <div className="max-w-7xl mx-auto px-4">
  
        {/* ✅ 필수! 정책 링크 */}
        <div className="flex justify-center gap-6 mb-4">
          <a
            href="/privacy"
            className="text-sm text-gray-700 hover:text-primary hover:underline"
          >
            개인정보처리방침
          </a>
          <span className="text-gray-400">|</span>
          <a
            href="/terms"
            className="text-sm text-gray-700 hover:text-primary hover:underline"
          >
            이용약관
          </a>
        </div>

        {/* 연락처 */}
        <div className="text-center text-xs text-gray-500 mb-4">
          <p>문의: mtm1018@naver.com</p>
        </div>

        {/* 저작권 */}
        <div className="text-center text-xs text-gray-400">
          <p>© 2026 WEPLAN. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
